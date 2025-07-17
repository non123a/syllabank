<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropCoursesAcademicYearsSemestersUsersTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('courses_academic_years_semesters_users');
    }

    public function down()
    {
        // If you need to recreate the table in case of rollback,
        // you can add the creation logic here.
    }
}
