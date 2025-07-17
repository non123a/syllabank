<?php

namespace Domain\Syllabus\Actions;

use Domain\Syllabus\Models\SyllabusTemplate;
use Illuminate\Http\Request;

class CreateATemplate
{
    public function execute(Request $request)
    {
        $content = $request->input('content');
        $cleanedContent = $this->cleanContent($content);

        SyllabusTemplate::create([
            'name' => $request->input('name'),
            'content' => $cleanedContent,
            'description' => $request->input('description'),
            'is_active' => true,
        ]);
    }

    private function cleanContent($content)
    {
        // Remove extra backslashes
        $cleanedContent = stripslashes($content);

        // Ensure it's valid JSON
        $decodedContent = json_decode($cleanedContent);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $cleanedContent;
        }

        // If it's not valid JSON, return the original content
        return $content;
    }

    private function processNestedJson($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                if (is_string($value)) {
                    // Try to decode any string values that might be JSON
                    $decoded = json_decode($value, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data[$key] = $this->processNestedJson($decoded);
                    }
                } elseif (is_array($value)) {
                    $data[$key] = $this->processNestedJson($value);
                }
            }
        }
        return $data;
    }
}