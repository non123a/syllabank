<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use App\Management\Renderers\SyllabusRenderer;
use ZipArchive;

class DownloadOneOrManySyllabiAsPdf
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

        return Response::make($pdfContent, 200, [
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
            $zip->addFromString($filename, $pdfContent);
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
            } elseif ($syllabus->pdf_file_path) {
                return Storage::get($syllabus->pdf_file_path);
            } else {
                throw new \Exception("PDF data is missing for syllabus ID: " . $syllabus->id);
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
}
