<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\DataTransferObjects\SaveSyllabusProgressData;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;

class SaveSyllabusProgress
{
    public function execute(int $id, SaveSyllabusProgressData $data): Syllabus
    {
        Log::info('Executing SaveSyllabusProgress', ['id' => $id, 'data' => $data]);

        $syllabus = Syllabus::findOrFail($id);

        Log::info('Syllabus found', ['id' => $syllabus->id, 'is_file_upload' => $syllabus->is_file_upload]);

        if ($syllabus->is_file_upload) {
            $this->handleFileUpload($syllabus, $data);
        } else {
            $this->handleContentUpdate($syllabus, $data);
        }

        $syllabus->save();
        Log::info('Syllabus saved successfully', ['id' => $syllabus->id]);

        return $syllabus;
    }

    private function handleFileUpload(Syllabus $syllabus, SaveSyllabusProgressData $data): void
    {
        Log::info('Handling file upload for syllabus');
        if ($data->pdfFile instanceof UploadedFile) {
            Log::info('PDF file present', ['filename' => $data->pdfFile->getClientOriginalName()]);
            $pdfContent = $this->getPdfContent($data->pdfFile);
            if ($pdfContent) {
                Log::info('PDF content read successfully', ['size' => strlen($pdfContent)]);
                $syllabus->pdf_base64 = base64_encode($pdfContent);
                $syllabus->content = null; // Clear the content field for file uploads
                Log::info('PDF content encoded and saved');
            } else {
                Log::error('Failed to read PDF content');
                throw new \Exception('Failed to read PDF content');
            }
        } else {
            Log::error('PDF file is missing or invalid for file upload syllabus');
            throw new \Exception('Valid PDF file is required for file upload syllabus');
        }
    }

    private function handleContentUpdate(Syllabus $syllabus, SaveSyllabusProgressData $data): void
    {
        Log::info('Handling content update for syllabus');
        if ($data->content !== null) {
            $syllabus->content = $data->content;
            $syllabus->pdf_base64 = null; // Clear the pdf_base64 field for non-file uploads
            Log::info('Content saved for non-file upload syllabus');
        } else {
            Log::error('Content is missing for non-file upload syllabus');
            throw new \Exception('Content is required for non-file upload syllabus');
        }
    }

    private function getPdfContent($pdfFile)
    {
        Log::info('Getting PDF content', ['file' => $pdfFile instanceof UploadedFile ? $pdfFile->getClientOriginalName() : 'string path']);
        if ($pdfFile instanceof UploadedFile) {
            return file_get_contents($pdfFile->path());
        } elseif (is_string($pdfFile) && file_exists($pdfFile)) {
            return file_get_contents($pdfFile);
        }
        return null;
    }
}
