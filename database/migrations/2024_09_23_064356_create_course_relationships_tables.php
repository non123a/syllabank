<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCourseRelationshipsTables extends Migration
{
    public function up()
    {
        Schema::create('course_academic_year_semester', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('academic_year_id');
            $table->unsignedBigInteger('semester_id');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->onDelete('cascade');
            $table->foreign('semester_id')->references('id')->on('semesters')->onDelete('cascade');

            $table->unique(['course_id', 'academic_year_id', 'semester_id']);
        });

        Schema::create('course_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unique(['course_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('course_academic_year_semester');
        Schema::dropIfExists('course_user');
    }
}
