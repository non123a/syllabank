<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAcademicPeriodToCoursesTable extends Migration
{
    public function up()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->unsignedBigInteger('academic_year_id')->nullable();
            $table->integer('semester')->nullable();
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn(['academic_year_id', 'semester']);
        });
    }
}