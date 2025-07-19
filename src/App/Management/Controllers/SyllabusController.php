<?php

namespace App\Management\Controllers;

use App\Domain\Syllabus\Actions\CreateSyllabusRequestForm;
use App\Http\Controllers\Controller;
use App\Management\Renderers\SyllabusRenderer;
use App\Management\Resources\SyllabusResource;
use Barryvdh\DomPDF\PDF;
use Domain\Syllabus\Actions\AddCommentToSyllabus;
use Domain\Syllabus\DataTransferObjects\CreateASyllabusData;
use Domain\Syllabus\Actions\CreateASyllabus;
use Domain\Syllabus\Actions\CreateATemplate;
use Domain\Syllabus\Actions\CreateSyllabus;
use Domain\Syllabus\Actions\DisableATemplate;
use Domain\Syllabus\Actions\DownloadOneOrManySyllabiAsPdf;
use Domain\Syllabus\Actions\DownloadWithWatermark;
use Domain\Syllabus\Actions\QueryApprovedSyllabi;
use Domain\Syllabus\Actions\QueryInstructorSyllabi;
use Domain\Syllabus\Actions\QueryAssignedCourses;
use Domain\Syllabus\Actions\QueryFilterApprovedSyllabiForStudent;
use Domain\Syllabus\Actions\QueryFilteredSyllabusTemplate;
use Domain\Syllabus\Actions\QueryMySyllabusReqeustForm;
use Domain\Syllabus\Actions\RejectSyllabus;
use Domain\Syllabus\Actions\RetrieveSyllabusById;
use Domain\Syllabus\Actions\SaveFileUpload;
use Domain\Syllabus\Actions\SaveSyllabusProgress;
use Domain\Syllabus\Actions\SubmitSyllabus;
use Domain\Syllabus\Actions\SubmitSyllabusRequestForm;
use Domain\Syllabus\Actions\UploadSyllabusFile;
use Domain\Syllabus\DataTransferObjects\SaveSyllabusProgressData;
use Domain\Syllabus\DataTransferObjects\SubmitSyllabusData;
use Domain\Syllabus\DataTransferObjects\UploadSyllabusFileData;
use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\Models\SyllabusRequestForm;
use Domain\Syllabus\Models\SyllabusTemplate;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Ismaelw\LaraTeX\LaraTeX;
use Illuminate\Support\Str;
use Ismaelw\LaraTeX\RawTex;
use PhpOffice\PhpSpreadsheet\Helper\Downloader;
use Smalot\PdfParser\Parser;
use setasign\Fpdi\Tcpdf\Fpdi;

class SyllabusController extends Controller
{

    public function generatePDF()
    {
        $data = [
            'courseCode' => 'CS101',
            'academicYear' => '2024/2025',
            'semester' => 'Fall Semester',
            'credits' => '3',
            'instructorName' => 'Dr. Jane Doe',
            'instructorContact' => 'jane.doe@example.com | Office: Room 301',
            'officeHours' => 'Monday and Wednesday, 2-4 PM',
            'courseDescription' => 'This course introduces students to the fundamentals of computer science...',
            'courseObjectives' => [
                'Understand basic programming concepts',
                'Learn problem-solving techniques',
                'Develop proficiency in a programming language'
            ],
            'learningOutcomes' => [
                'Write basic programs using a high-level programming language',
                'Apply problem-solving skills to design algorithms',
                'Understand and use basic data structures'
            ],
            'learningResources' => 'Textbook: "Introduction to Computer Science" by John Smith, Laptop with installed IDE',
            'assessments' => [
                'Assignments' => '30%',
                'Midterm Exam' => '25%',
                'Final Project' => '35%'
            ],
            'attendancePolicy' => 'Attendance is mandatory and will be taken at the beginning of each class.',
            'academicIntegrityPolicy' => 'All work must be your own. Plagiarism and cheating will result in a failing grade for the assignment and possibly the course.',
            'courseSchedule' => [
                'Week 1' => [
                    'theme' => 'Introduction to Programming',
                    'contents' => 'Basic concepts, variables, data types',
                    'assignments' => 'Read Chapter 1, Complete online quiz'
                ],
                'Week 2' => [
                    'theme' => 'Control Structures',
                    'contents' => 'If statements, loops',
                    'assignments' => 'Read Chapter 2, Programming assignment #1'
                ],
                // Add more weeks as needed
            ],
            'notes' => 'This syllabus is subject to change. Any modifications will be announced in class and posted online.'
        ];

        // Get the absolute path to the logo file
        $logoPath = public_path('images/logo.png');

        // Check if the logo file exists
        if (file_exists($logoPath)) {
            // If it exists, we'll use data URI to embed the image directly in the HTML
            $logoData = base64_encode(file_get_contents($logoPath));
            $data['logoSrc'] = 'data:image/png;base64,' . $logoData;
        } else {
            // If the file doesn't exist, log an error and set logoSrc to null
            $data['logoSrc'] = null;
        }

        $pdf = app('dompdf.wrapper')->loadView('welcome', $data);

        // Set paper size and orientation
        $pdf->setPaper('A4', 'landscape');

        // Enable CSS float and position
        $pdf->getOptions()->set('isHtml5ParserEnabled', true);
        $pdf->getOptions()->set('isPhpEnabled', true);

        // Increase memory limit if needed
        ini_set('memory_limit', '256M');

        return $pdf->stream('course_syllabus.pdf');
    }

    // Ignore above

    public function pdfToHtml(Request $request)
    {
        $request->validate([
            'pdf_file' => 'required|file|mimes:pdf|max:10240', // max 10MB
        ]);

        $pdfFile = $request->file('pdf_file');

        // Create new PDF document
        $pdf = new Fpdi();

        // Disable automatic page breaks
        $pdf->SetAutoPageBreak(false);

        // Set the source file
        $pageCount = $pdf->setSourceFile($pdfFile->path());

        $html = '<div style="width:100%;">';

        // Import and convert each page
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $templateId = $pdf->importPage($pageNo);

            // Get page dimensions
            $size = $pdf->getTemplateSize($templateId);
            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);

            $pdf->useTemplate($templateId);

            // Extract text from the page
            $textContent = $this->extractTextFromPage($pdf);

            // Basic HTML structure for the page
            $html .= "<div style='page-break-after: always; position: relative; width: {$size['width']}pt; height: {$size['height']}pt;'>";
            $html .= nl2br(htmlspecialchars($textContent));
            $html .= "</div>";
        }

        $html .= '</div>';

        return response($html)->header('Content-Type', 'text/html');
    }

    private function extractTextFromPage($pdf)
    {
        // Get the page content as a string
        $content = $pdf->getPageBuffer($pdf->getPage());

        // Create a temporary file
        $tempFile = tempnam(sys_get_temp_dir(), 'pdf');
        file_put_contents($tempFile, $content);

        // Use pdftotext to extract the text
        $text = shell_exec("pdftotext $tempFile -");

        // Remove the temporary file
        unlink($tempFile);

        return $text;
    }


    // Ignore above


    public function getLogoImage()
    {
        $logoPath = public_path('images/logo.png');
        if (file_exists($logoPath)) {
            return response()->download($logoPath, 'logo.png');
        } else {
            return response()->json(['message' => 'Logo image not found'], 404);
        }
    }

    public function getWordDocumentTemplate()
    {
        $templatePath = public_path('templates/PIUTemplate.docx');
        if (file_exists($templatePath)) {
            return response()->download($templatePath, 'PIUTemplate.docx');
        } else {
            return response()->json(['message' => 'Template not found'], 404);
        }
    }

    public function queryFilterApprovedSyllabiForStudent(Request $request, QueryFilterApprovedSyllabiForStudent $queryFilterApprovedSyllabiForStudent)
    {
        $syllabi = $queryFilterApprovedSyllabiForStudent->execute($request);
        return response()->json($syllabi);
    }

    public function submitSyllabusRequestForm(Request $request, SubmitSyllabusRequestForm $submitSyllabusRequestForm)
    {
        $data = $request->all();

        $syllabusRequestForm = $submitSyllabusRequestForm->execute($data);

        return response()->json([
            'message' => 'Syllabus request submitted successfully',
            'data' => $syllabusRequestForm
        ], 201);
    }

    public function queryMySyllabusRequestForms(Request $request, QueryMySyllabusReqeustForm $queryMySyllabusReqeustForm)
    {
        $syllabusRequests = $queryMySyllabusReqeustForm->execute();
        return response()->json($syllabusRequests);
    }

    public function handleDownloadSyllabus($id, DownloadOneOrManySyllabiAsPdf $downloadOneOrManySyllabiAsPdf)
    {
        return $downloadOneOrManySyllabiAsPdf->execute($id);
    }

    public function handleBulkDownload(Request $request, DownloadOneOrManySyllabiAsPdf $downloadOneOrManySyllabiAsPdf)
    {
        $ids = $request->input('ids');
        return $downloadOneOrManySyllabiAsPdf->execute($ids);
    }

    public function handleDownloadWithWatermark($id, DownloadWithWatermark $downloadWithWatermark)
    {
        return $downloadWithWatermark->execute($id);
    }

    public function handleBulkDownloadWithWatermark(Request $request, DownloadWithWatermark $downloadWithWatermark)
    {
        $ids = $request->input('ids');
        return $downloadWithWatermark->execute($ids);
    }

    public function addCommentToSyllabus($id, Request $request, AddCommentToSyllabus $addCommentToSyllabus)
    {
        $data = $request->validate([
            'content' => 'required|string',
            'eventId' => 'required|string',
        ]);

        $result = $addCommentToSyllabus->execute($id, $data);

        return response()->json([
            'message' => 'Comment added successfully',
            'status_timeline' => $result->status_timeline
        ], 200);
    }

    public function showSyllabus($id, RetrieveSyllabusById $retrieveSyllabusById)
    {
        return $retrieveSyllabusById->execute($id);
    }

    public function approveSyllabus(Request $request, $id)
    {
        $syllabusRequestForm = SyllabusRequestForm::findOrFail($id);
        $feedback = $request->input('feedback');

        DB::beginTransaction();
        try {
            $syllabusRequestForm->status = 'approved';
            $syllabusRequestForm->feedback = $feedback;
            $syllabusRequestForm->head_of_dept_id = auth()->id();
            $syllabusRequestForm->save();

            DB::commit();
            return response()->json(['message' => 'Syllabus request form approved successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error approving syllabus request form: ' . $e->getMessage()], 500);
        }
    }

    public function rejectSyllabus(Request $request, $id)
    {
        $syllabusRequestForm = SyllabusRequestForm::findOrFail($id);
        $feedback = $request->input('feedback');

        if (!$feedback) {
            return response()->json(['message' => 'Feedback is required for rejection'], 400);
        }

        DB::beginTransaction();
        try {
            $syllabusRequestForm->status = 'rejected';
            $syllabusRequestForm->feedback = $feedback;
            $syllabusRequestForm->head_of_dept_id = auth()->id();
            $syllabusRequestForm->save();

            DB::commit();
            return response()->json(['message' => 'Syllabus request form rejected successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error rejecting syllabus request form: ' . $e->getMessage()], 500);
        }
    }

    public function queryApprovedSyllabi(Request $request, QueryApprovedSyllabi $queryApprovedSyllabi)
    {
        return SyllabusResource::collection($queryApprovedSyllabi->execute($request));
    }

    public function queryAssignedCourses(QueryAssignedCourses $queryAssignedCourses)
    {
        $instructor = auth()->user();
        return $queryAssignedCourses->execute($instructor->id);
    }

    public function createASyllabus(Request $request, CreateASyllabus $createASyllabus)
    {
        try {
            $authorId = auth()->id();
            $authorName = auth()->user()->name;

            $data = CreateASyllabusData::from([
                ...$request->all(),
                'author_id' => $authorId,
                'author_name' => $authorName,
                'pdfFile' => $request->file('pdfFile') ?? $request->input('pdfFile'),
                'isFileUpload' => filter_var($request->input('isFileUpload'), FILTER_VALIDATE_BOOLEAN),
            ]);

            $result = $createASyllabus->execute($data);

            return response()->json(['message' => 'Syllabus created successfully', 'data' => $result], 200);
        } catch (\Exception $e) {
            Log::error('Error creating syllabus', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Error creating syllabus: ' . $e->getMessage()], 400);
        }
    }

    public function queryFilteredSyllabusTemplate(QueryFilteredSyllabusTemplate $queryFilteredSyllabusTemplate)
    {
        $syllabusTemplate = $queryFilteredSyllabusTemplate->execute();
        return response()->json($syllabusTemplate);
    }

    public function createATemplate(Request $request, CreateATemplate $createATemplate)
    {
        $result = $createATemplate->execute($request);

        return response()->json(['message' => 'Template created successfully'], 200);
    }

    public function disableATemplate($id, DisableATemplate $disableATemplate)
    {
        try {
            $result = $disableATemplate->execute($id);
            return response()->json(['message' => 'Template disabled successfully', 'template' => $result], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while disabling the template'], 500);
        }
    }

    public function saveProgress($id, Request $request, SaveSyllabusProgress $saveSyllabusProgress)
    {
        try {
            $syllabus = Syllabus::findOrFail($id);

            Log::info('Saving progress for syllabus', ['id' => $id, 'is_file_upload' => $syllabus->is_file_upload]);

            if ($syllabus->is_file_upload) {
                $request->validate([
                    'pdfFile' => 'required|file|mimes:pdf|max:10240', // 10MB max
                ]);
                Log::info('File upload detected', ['file' => filter_var($request->input('isFileUpload'), FILTER_VALIDATE_BOOLEAN)]);
            } else {
                $request->validate([
                    'content' => 'required|string',
                ]);
            }

            $data = new SaveSyllabusProgressData(
                $request->input('content'),
                $request->file('pdfFile')
            );

            Log::info('SaveSyllabusProgressData created', ['content' => $data->content ? 'Present' : 'Null', 'pdfFile' => $data->pdfFile ? 'Present' : 'Null']);

            $result = $saveSyllabusProgress->execute($id, $data);

            Log::info('Progress saved successfully', ['id' => $result->id]);

            return response()->json([
                'message' => 'Progress saved successfully',
                'data' => $result
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to save progress', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to save progress',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function saveFileUpload($id, Request $request, SaveFileUpload $saveFileUpload)
    {
        return $saveFileUpload->execute($id, $request);
    }

    public function renderCustom(Request $request)
    {
        $request->validate([
            'content' => 'required|json',
        ]);

        $content = json_decode($request->input('content'), true);

        if (!is_array($content) || !isset($content['body'])) {
            return response()->json(['error' => 'Invalid content format'], 400);
        }

        // Create SyllabusRenderer instance
        $renderer = new SyllabusRenderer($content);

        // Generate HTML from the content
        $htmlContent = $renderer->render();

        // Generate PDF from HTML
        $pdf = app('dompdf.wrapper')->loadHtml($htmlContent);
        $pdf->setPaper('A4', 'landscape');
        $pdf->getOptions()->set('isHtml5ParserEnabled', true);
        $pdf->getOptions()->set('isPhpEnabled', true);

        // Render PDF to string
        $pdfContent = $pdf->output();

        // Encode PDF content to base64
        $base64 = base64_encode($pdfContent);

        return response()->json(['pdf' => $base64]);
    }

    private function generateHtmlFromContent($content)
    {
        $html = '<!DOCTYPE html><html lang="en"><head>';
        $html .= '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">';
        $html .= '<title>' . ($content['body']['header']['courseInfo']['courseCode'] ?? '[Course Code]') . ' Syllabus</title>';
        $html .= '<style>';
        // Add your CSS styles here
        $html .= '</style></head><body>';

        // Header
        $html .= $this->generateHeader($content['body']['header']);

        // Content
        $html .= '<div class="content">';
        foreach ($content['body']['content'] as $section => $data) {
            $html .= $this->generateSection($section, $data);
        }
        $html .= '</div>';

        // Footer
        $html .= $this->generateFooter($content['body']['footer']);

        $html .= '</body></html>';
        return $html;
    }

    private function generateHeader($header)
    {
        $html = '<div class="header">';
        $html .= '<div class="logo-container">';
        $html .= '<img src="' . ($header['logo']['src'] ?? '') . '" alt="' . ($header['logo']['alt'] ?? 'University Logo') . '" class="logo">';
        $html .= '</div>';
        $html .= '<div class="course-info">';
        foreach ($header['courseInfo'] as $key => $value) {
            $html .= "<p><strong>$value</strong></p>";
        }
        $html .= '</div>';
        $html .= '<div class="header-divider"></div>';
        $html .= '</div>';
        return $html;
    }

    private function generateSection($section, $data)
    {
        $html = "<div class='section'>";
        $html .= "<h2 class='section-title'>" . (isset($data['title']) ? $data['title'] : $section) . "</h2>";

        if (isset($data['description'])) {
            $html .= "<p>{$data['description']}</p>";
        }

        if (isset($data['content'])) {
            $html .= is_string($data['content']) ? $data['content'] : "<p>{$data['content']}</p>";
        }

        if (isset($data['list'])) {
            $html .= $this->generateList($data['list']);
        }

        if (isset($data['table'])) {
            $html .= $this->generateTable($data['table']);
        }

        if (isset($data['policies'])) {
            $html .= $this->renderPolicies($data['policies']);
        }

        $html .= "</div>";
        return $html;
    }

    private function generateFooter($footer)
    {
        return "<div class='footer'><p>{$footer['content']}</p></div>";
    }

    public function renderLatex(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $latexContent = $request->input('content');

        // Replace image placeholder with the actual path to the logo
        $logoPath = public_path('images/logo.png');
        $latexContent = str_replace('image.png', $logoPath, $latexContent);

        try {
            // Create a LaraTeX instance with the raw LaTeX content
            $latex = new LaraTeX(new RawTex($latexContent));

            // Generate the PDF content
            $pdfContent = $latex->content();

            // Ensure $pdfContent is a string before base64 encoding
            if (!is_string($pdfContent)) {
                throw new \Exception('PDF content is not a string');
            }

            // Convert PDF content to Base64
            $base64 = base64_encode($pdfContent);

            return response()->json(['pdf' => $base64]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to render LaTeX: ' . $e->getMessage()], 500);
        }
    }

    private function cleanupTempDir($dir)
    {
        $files = glob($dir . '/*');
        foreach ($files as $file) {
            is_dir($file) ? $this->cleanupTempDir($file) : unlink($file);
        }
        rmdir($dir);
    }


    public function submit(Request $request, SubmitSyllabus $submitSyllabus)
    {
        $data = SubmitSyllabusData::from($request->all());
        $result = $submitSyllabus->execute($data);

        return response()->json(['message' => 'Syllabus submitted successfully'], 200);
    }

    public function reject(Request $request, RejectSyllabus $rejectSyllabus)
    {
        $result = $rejectSyllabus->execute([
            'id' => $request->input('id')
        ]);

        return response()->json(['message' => 'Syllabus rejected successfully'], 200);
    }


    public function uploadFile(Request $request, UploadSyllabusFile $uploadSyllabusFile)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'sections' => 'required|string',
            'credits' => 'required|integer',
            'syllabus_name' => 'required|string',
            'pdf_file' => 'required|file|mimes:pdf|max:10240', // 10MB max
        ]);
        $creditValue = $request->input('credits') ?? $request->input('credit');

        $data = new UploadSyllabusFileData(
            $request->file('pdf_file'),
            $request->input('course_id'),
            $request->input('sections'),
            $request->input('credits'),
            $request->input('syllabus_name')
        );

        $result = $uploadSyllabusFile->execute($data);

        return SyllabusResource::make($result);
    }

    public function getTemplates()
    {
        $templates = SyllabusTemplate::where('is_active', true)->get();
        return response()->json($templates);
    }

    public function getTemplateContent($id)
    {
        $template = SyllabusTemplate::findOrFail($id);
        return response()->json([
            'name' => $template->name,
            'content' => $template->content,
        ]);
    }

    public function previewTemplate($templateId)
    {
        $template = SyllabusTemplate::findOrFail($templateId);

        $fullContent = $this->combineHeadersAndContent($template->headers, $template->content);

        // Generate a unique filename for the preview
        $filename = 'preview_' . Str::random(10) . '.pdf';

        // Use LaraTeX to render the template
        $pdf = new LaraTeX($fullContent);
        $pdfContent = $pdf->render();

        // Store the generated PDF temporarily
        Storage::put('temp/' . $filename, $pdfContent);

        // Generate a temporary URL for the PDF
        $temporaryUrl = Storage::temporaryUrl(
            'temp/' . $filename,
            now()->addMinutes(5)
        );

        return response()->json([
            'preview_url' => $temporaryUrl
        ]);
    }

    private function combineHeadersAndContent($headers, $content)
    {
        // Combine headers and content into a full LaTeX document
        $fullContent = "\\documentclass{article}\n";
        foreach ($headers as $header) {
            $fullContent .= $header . "\n";
        }
        $fullContent .= "\\begin{document}\n";
        $fullContent .= $content;
        $fullContent .= "\\end{document}";

        return $fullContent;
    }

    private function generateTable($content)
    {
        if (is_string($content)) {
            return $content;
        }

        if (!is_array($content)) {
            Log::error("Invalid data type passed to generateTable(). Expected array or string, got " . gettype($content));
            return "<p>Error: Invalid data format for table generation.</p>";
        }

        $html = '<table>';

        // Add table header
        if (isset($content['headers']) && is_array($content['headers'])) {
            $html .= '<thead><tr>';
            foreach ($content['headers'] as $header) {
                $html .= '<th>' . htmlspecialchars($header) . '</th>';
            }
            $html .= '</tr></thead>';
        }

        // Add table body
        $html .= '<tbody>';
        if (isset($content['rows'])) {
            if (is_array($content['rows'])) {
                foreach ($content['rows'] as $row) {
                    $html .= '<tr>';
                    if (is_array($row)) {
                        foreach ($row as $cell) {
                            $html .= '<td>' . htmlspecialchars($cell) . '</td>';
                        }
                    } else {
                        $html .= '<td>' . htmlspecialchars($row) . '</td>';
                    }
                    $html .= '</tr>';
                }
            } elseif (is_string($content['rows'])) {
                $html .= $content['rows'];
            }
        }
        $html .= '</tbody>';

        $html .= '</table>';
        return $html;
    }

    private function generateList($content)
    {
        $html = '<ul>';
        if (is_array($content)) {
            foreach ($content as $item) {
                $html .= '<li>' . $item . '</li>';
            }
        } elseif (is_string($content)) {
            $html .= '<li>' . $content . '</li>';
        }
        $html .= '</ul>';
        return $html;
    }

    private function renderPolicies(array $policies): string
    {
        $html = "<ul>\n";
        foreach ($policies as $policy) {
            if (is_array($policy)) {
                $html .= "<li><strong>{$policy['name']}:</strong> {$policy['content']}</li>\n";
            } else {
                $html .= $policy . "\n";
            }
        }
        $html .= "</ul>\n";
        return $html;
    }
}
