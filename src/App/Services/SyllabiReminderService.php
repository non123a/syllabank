<?php

namespace App\Services;

use App\Models\AcademicYear;
use App\Models\User;
use App\Mail\SyllabiReminderMail;
use Domain\AcademicPeriod\Models\AcademicYear as ModelsAcademicYear;
use Illuminate\Support\Facades\Mail;

class SyllabiReminderService
{
    public function sendReminders($reminderThreshold)
    {
        $currentDate = now();
        $upcomingSemesters = $this->getUpcomingSemesters($currentDate, $reminderThreshold);

        $result = [
            'upcoming_semesters' => $upcomingSemesters->count(),
            'upcoming_semesters_data' => $upcomingSemesters,
            'instructors_notified' => 0,
        ];

        if ($upcomingSemesters->isNotEmpty()) {
            $result['instructors_notified'] = $this->notifyInstructors($upcomingSemesters);
        }

        return $result;
    }

    private function getUpcomingSemesters($currentDate, $reminderThreshold)
    {
        return ModelsAcademicYear::with('semesters')
            ->get()
            ->filter(function ($academicYear) use ($currentDate) {
                return $currentDate->between($academicYear->start_date, $academicYear->end_date);
            })
            ->pluck('semesters')
            ->flatten()
            ->filter(function ($semester) use ($currentDate, $reminderThreshold) {
                return $semester->start_date->diffInDays($currentDate) <= $reminderThreshold;
            });
    }

    private function notifyInstructors($upcomingSemesters)
    {
        $instructorsNotified = 0;
        $instructors = User::role('instructor')->get();

        foreach ($instructors as $instructor) {
            try {
                Mail::to($instructor)->send(new SyllabiReminderMail($upcomingSemesters));
                $instructorsNotified++;
                \Illuminate\Support\Facades\Log::info("Reminder email sent to instructor: " . $instructor->email);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Failed to send reminder email to instructor: " . $instructor->email . ". Error: " . $e->getMessage());
            }
        }

        return $instructorsNotified;
    }
}