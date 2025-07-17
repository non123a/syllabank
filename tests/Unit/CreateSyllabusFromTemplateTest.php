<?php

namespace Tests\Unit;

use Domain\Course\Actions\CreateSyllabusFromTemplate;
use Domain\Course\Models\Course;
use Domain\Syllabus\DataTransferObjects\CreateSyllabusFromTemplateData;
use Domain\Syllabus\Models\Syllabus;
use Domain\Syllabus\States\SyllabusState;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\View;
use Tests\TestCase;

class CreateSyllabusFromTemplateTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_syllabus_from_template()
    {
        // Arrange
        $course = Course::factory()->create();
        $data = new CreateSyllabusFromTemplateData(
            courseId: $course->id,
            syllabusName: 'Test Syllabus',
            content: 'Test content',
            status: SyllabusState::class,
            logo_path: 'path/to/logo.png',
            course_code: 'TEST101',
            academic_year: '2023-2024',
            semester: 'Fall',
            credits: '3'
        );

        View::shouldReceive('make')
            ->once()
            ->with('syllabi.syllabus_template', [
                'logo_path' => $data->logo_path,
                'course_code' => $data->course_code,
                'academic_year' => $data->academic_year,
                'semester' => $data->semester,
                'credits' => $data->credits,
                'content' => $data->content,
            ])
            ->andReturn(new class {
                public function render()
                {
                    return 'Rendered template content';
                }
            });

        $action = new CreateSyllabusFromTemplate();

        // Act
        $syllabus = $action->execute($data);

        // Assert
        $this->assertInstanceOf(Syllabus::class, $syllabus);
        $this->assertEquals($course->id, $syllabus->course_id);
        $this->assertEquals('Test Syllabus', $syllabus->syllabus_name);
        $this->assertEquals(SyllabusState::class, $syllabus->status);
        $this->assertEquals('Rendered template content', $syllabus->content);
        $this->assertDatabaseHas('syllabi', [
            'id' => $syllabus->id,
            'course_id' => $course->id,
            'syllabus_name' => 'Test Syllabus',
            'content' => 'Rendered template content',
        ]);
    }
}
