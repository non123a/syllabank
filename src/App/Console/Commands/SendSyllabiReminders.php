<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\SyllabiReminderMail;
use Illuminate\Support\Facades\Mail;
use Domain\AcademicPeriod\Models\AcademicYear;
use Domain\User\Models\User;
use Illuminate\Support\Facades\Log;

class SendSyllabiReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'syllabi:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminders to instructors about upcoming syllabi submissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $currentDate = now();
        $reminderThreshold = 14;

        $upcomingSemesters = AcademicYear::with('semesters')
            ->get()
            ->filter(function ($academicYear) use ($currentDate) {
                return $currentDate->between($academicYear->start_date, $academicYear->end_date);
            })
            ->pluck('semesters')
            ->flatten()
            ->filter(function ($semester) use ($currentDate, $reminderThreshold) {
                return $semester->start_date->diffInDays($currentDate) <= $reminderThreshold;
            });

        $result = [
            'upcoming_semesters' => $upcomingSemesters->count(),
            'instructors_notified' => 0,
        ];

        if ($upcomingSemesters->isNotEmpty()) {
            $instructors = User::role('instructor')->get();

            $this->info("Found {$instructors->count()} instructors");

            if ($instructors->isEmpty()) {
                $this->warn("No instructors found in the system");
                return;
            }

            foreach ($instructors as $instructor) {
                try {
                    $this->info("Attempting to send email to: {$instructor->email}");
                    Mail::to($instructor)->send(new SyllabiReminderMail($upcomingSemesters));
                    $result['instructors_notified']++;
                    Log::info("Reminder email sent to instructor: " . $instructor->email);
                } catch (\Exception $e) {
                    $this->error("Failed to send to {$instructor->email}: {$e->getMessage()}");
                    Log::error("Failed to send reminder email to instructor: " . $instructor->email . ". Error: " . $e->getMessage());
                }
            }
        } else {
            $this->info("No upcoming semesters found within the {$reminderThreshold} day threshold");
        }

        $this->info("Reminders sent. Upcoming semesters: {$result['upcoming_semesters']}, Instructors notified: {$result['instructors_notified']}");
    }
}
