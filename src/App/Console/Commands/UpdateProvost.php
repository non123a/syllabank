<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class UpdateProvost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'provost:update {identification_number} {name}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update a provost in the system.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $provost = \Domain\User\Models\User::role('provost')->where('identification_number', $this->argument('identification_number'))->first();

        if (!$provost) {
            $this->error('Provost not found.');

            return;
        }

        $provost->update([
            'name' => $this->argument('name'),
        ]);

        $this->info('Provost updated successfully.');
    }
}
