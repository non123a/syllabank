<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\Syllabus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SaveFileUpload
{
    public function execute(int $id, Request $request): Syllabus
    {
        $syllabus = Syllabus::findOrFail($id);

        if ($request->hasFile('pdfFile')) {
            $pdfFile = $request->file('pdfFile');

            if ($pdfFile->isValid()) {
                $pdfContent = file_get_contents($pdfFile->path());
                if ($pdfContent !== false) {
                    $syllabus->pdf_base64 = base64_encode($pdfContent);
                    $syllabus->content = null; // Clear the content field for file uploads
                    $syllabus->is_file_upload = true;
                    $syllabus->save();

                    Log::info('PDF file updated successfully for syllabus', ['id' => $syllabus->id]);
                } else {
                    Log::error('Failed to read PDF content', ['id' => $syllabus->id]);
                    throw new \Exception('Failed to read PDF content');
                }
            } else {
                Log::error('Invalid PDF file', ['id' => $syllabus->id]);
                throw new \Exception('Invalid PDF file');
            }
        } else {
            Log::error('No PDF file provided', ['id' => $syllabus->id]);
            throw new \Exception('No PDF file provided');
        }

        return $syllabus;
    }
}
