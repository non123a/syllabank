<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('syllabus_request_forms', function (Blueprint $table) {
            $table->id();
            $table->jsonb('forms');
            $table->text('description');
            $table->text('feedback')->default('');
            $table->string('status')->default('pending');
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('head_of_dept_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained('academic_years')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syllabus_request_forms');
    }
};
