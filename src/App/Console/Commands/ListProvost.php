<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ListProvost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'provost:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all provosts in the system.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $provosts = \Domain\User\Models\User::role('provost')->get();

        $this->table(
            ['ID', 'Name', 'Email'],
            $provosts->map(function ($provost) {
                return [$provost->identification_number, $provost->name, $provost->email];
            })
        );
    }
}
