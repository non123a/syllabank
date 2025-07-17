<?php

namespace Domain\AcademicPeriod\Actions;

class QueryMyAcademicPeriod
{
    public function execute()
    {
        if (
            request()
                ->user()->hasRole('instructor')
        ) {
            return request()
                ->user()
                ->teachingAcademicYears()
                ->with('semesters')
                ->jsonPaginate();
        }

        if (
            request()
                ->user()->hasRole('student')
        ) {
            return request()
                ->user()
                ->academicYears()
                ->with('semesters')
                ->jsonPaginate();
        }
    }
}
