<?php

namespace App\Management\Controllers;

use App\Http\Controllers\Controller;
use Domain\Class\Actions\CreateSectionForAClass;
use Domain\Class\Actions\DeleteAClassSectionById;
use Domain\Class\Actions\RetrieveSectionById;
use Domain\Class\Actions\UpdateASection;
use Domain\Class\DataTransferObjects\CreateSectionForAClassData;
use Domain\Class\DataTransferObjects\UpdateASectionData;
use Domain\User\Actions\AddStudentToClassSection;
use Domain\User\Actions\BulkAddStudentsToClassSectionWithSpreadSheet;
use Domain\User\Actions\RemoveStudentFromClassSection;
use Domain\User\DataTransferObjects\AddStudentToClassSectionData;
use Domain\User\DataTransferObjects\BulkAddStudentsToClassSectionWithSpreadSheetData;

class SectionController extends Controller
{
    public function showAClassSection($sectionId, RetrieveSectionById $retrieveSectionById)
    {
        return response()->json($retrieveSectionById->execute($sectionId));
    }

    public function storeClassSectionsWithSchedules(CreateSectionForAClassData $data, CreateSectionForAClass $createSectionsForAClass)
    {
        $createSectionsForAClass->execute($data);

        return response()->json(['message' => 'Sections created successfully'], 201);
    }

    public function addStudentToClassSection($sectionId, AddStudentToClassSectionData $data, AddStudentToClassSection $addStudentToClassSection)
    {
        $addStudentToClassSection->execute($sectionId, $data);

        return response()->json(['message' => 'Student added to class section'], 201);
    }

    public function removeStudentFromClassSection($sectionId, $studentId, RemoveStudentFromClassSection $removeStudentFromClassSection)
    {
        $removeStudentFromClassSection->execute($sectionId, $studentId);

        return response()->json(['message' => 'Student removed from class section'], 200);
    }

    public function bulkAddStudentsToClassSection($sectionId, BulkAddStudentsToClassSectionWithSpreadSheetData $data, BulkAddStudentsToClassSectionWithSpreadSheet $bulkAddStudentsToClassSection)
    {
        $bulkAddStudentsToClassSection->execute($data);

        return response()->json(['message' => 'Students added to class section'], 201);
    }

    public function updateAClassSection(UpdateASectionData $data, UpdateASection $updateASection)
    {
        $updateASection->execute($data);

        return response()->json(['message' => 'Section updated successfully'], 200);
    }

    public function deleteAClassSection($sectionId, DeleteAClassSectionById $deleteAClassSectionById)
    {
        $deleteAClassSectionById->execute($sectionId);

        return response()->json(['message' => 'Section deleted successfully'], 200);
    }
}

