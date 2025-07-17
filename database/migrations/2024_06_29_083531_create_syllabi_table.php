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
        Schema::create('syllabi', function (Blueprint $table) {
            $table->id();
            $table->string('syllabus_name');
            $table->string('status')->default('draft');
            $table->jsonb('content')->nullable();
            $table->text('pdf_base64')->nullable();
            $table->string('sections');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_file_upload')->default(false);
            $table->string('receiver_id')->nullable();
            $table->string('last_modified_by')->nullable();
            $table->string('course_assignment_id')->nullable();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->unsignedBigInteger('author_id')->nullable();
            $table->foreign('author_id')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syllabi');
    }
};