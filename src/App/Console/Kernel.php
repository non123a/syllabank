<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Storage;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Delete files older than 24 hours from the temp directory
        $schedule->call(function () {
            $files = Storage::disk('local')->files('temp');
            foreach ($files as $file) {
                if (now()->diffInHours(Storage::disk('local')->lastModified($file)) > 24) {
                    Storage::disk('local')->delete($file);
                }
            }
        })->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
