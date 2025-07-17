<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Management\Renderers\SyllabusRenderer;
use ZipArchive;
use setasign\Fpdi\Tcpdf\Fpdi;

class DownloadWithWatermark
{
    public function execute($ids)
    {
        if (!is_array($ids)) {
            $ids = [$ids];
        }

        $syllabi = Syllabus::whereIn('id', $ids)->get();

        if ($syllabi->isEmpty()) {
            return Response::json(['error' => 'No syllabi found'], 404);
        }

        if (count($syllabi) === 1) {
            return $this->downloadSingleSyllabus($syllabi->first());
        } else {
            return $this->downloadMultipleSyllabi($syllabi);
        }
    }

    private function downloadSingleSyllabus(Syllabus $syllabus)
    {
        $pdfContent = $this->getPdfContent($syllabus);
        $filename = $this->generateFilename($syllabus);

        // Apply watermark
        $watermarkedPdfContent = $this->applyWatermark($pdfContent);

        return Response::make($watermarkedPdfContent, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    private function downloadMultipleSyllabi($syllabi)
    {
        $zip = new ZipArchive();
        $zipFileName = 'syllabi_' . time() . '.zip';
        $tempDir = storage_path('app/temp');

        // Ensure the temporary directory exists
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }

        $zipFilePath = $tempDir . '/' . $zipFileName;

        if ($zip->open($zipFilePath, ZipArchive::CREATE) !== TRUE) {
            return Response::json(['error' => 'Could not create ZIP file'], 500);
        }

        foreach ($syllabi as $syllabus) {
            $pdfContent = $this->getPdfContent($syllabus);
            $filename = $this->generateFilename($syllabus);

            // Apply watermark
            $watermarkedPdfContent = $this->applyWatermark($pdfContent);

            $zip->addFromString($filename, $watermarkedPdfContent);
        }

        $zip->close();

        if (!file_exists($zipFilePath)) {
            return Response::json(['error' => 'Failed to create ZIP file'], 500);
        }

        return Response::download($zipFilePath, $zipFileName, [
            'Content-Type' => 'application/zip',
        ])->deleteFileAfterSend(true);
    }

    private function getPdfContent(Syllabus $syllabus)
    {
        if ($syllabus->is_file_upload) {
            if ($syllabus->pdf_base64) {
                return base64_decode($syllabus->pdf_base64);
            } else {
                // Fallback to file storage if pdf_base64 is not available
                throw new \Exception("PDF file not found");
            }
        } else {
            $renderer = new SyllabusRenderer(json_decode($syllabus->content, true));
            $html = $renderer->render();
            $pdf = app('dompdf.wrapper')->loadHtml($html);
            return $pdf->output();
        }
    }

    private function generateFilename(Syllabus $syllabus)
    {
        $courseName = preg_replace('/[^a-z0-9]+/', '-', strtolower($syllabus->syllabus_name));
        $courseCode = strtolower($syllabus->course_code);
        return "{$courseCode}-{$courseName}.pdf";
    }

    private function applyWatermark($pdfContent)
    {
        try {
            $logoPath = public_path('images/logo.png');

            if (!file_exists($logoPath)) {
                // If logo doesn't exist, return the original PDF content
                return $pdfContent;
            }

            // Create instance of FPDI
            $pdf = new Fpdi();

            // Create a temporary file for the PDF content
            $tempFile = tempnam(sys_get_temp_dir(), 'pdf_');
            file_put_contents($tempFile, $pdfContent);

            // Get the number of pages
            $pageCount = $pdf->setSourceFile($tempFile);

            for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                // Import a page
                $templateId = $pdf->importPage($pageNo);

                // Get the size of the imported page
                $size = $pdf->getTemplateSize($templateId);

                // Add a page with the same size as the imported page
                $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);

                // Use the imported page
                $pdf->useTemplate($templateId);

                // Calculate center position
                $centerX = $size['width'] / 2;
                $centerY = $size['height'] / 2;

                // Add the logo watermark on top of the page
                $pdf->SetAlpha(0.35); // 6.5% opacity (35% more transparent than before)
                $pdf->StartTransform();
                $pdf->Rotate(45, $centerX, $centerY);
                $pdf->Image($logoPath, $centerX - ($size['width'] * 0.6), $centerY - ($size['height'] / 6), $size['width'] * 1.2, $size['height'] / 3, '', '', '', false, 300, '', false, false, 0);
                $pdf->StopTransform();
                $pdf->SetAlpha(1); // Reset opacity
            }

            // Output the new PDF as a string
            $watermarkedPdfContent = $pdf->Output('', 'S');

            // Clean up the temporary file
            unlink($tempFile);

            return $watermarkedPdfContent;
        } catch (\Exception $e) {
            // If watermarking fails, return the original PDF content
            return $pdfContent;
        }
    }
}