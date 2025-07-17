<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DeleteProvost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'provost:delete {identification_number}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete a provost from the database by identification number.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $identificationNumber = $this->argument('identification_number');

        $provost = \Domain\User\Models\User::role('provost')->where('identification_number', $identificationNumber)->first();

        if ($provost) {
            $provost->delete();
            $this->info('Provost deleted successfully.');
        } else {
            $this->error('Provost not found.');
        }
    }
}
