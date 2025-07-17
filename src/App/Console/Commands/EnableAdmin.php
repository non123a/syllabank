<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class EnableAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:enable';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enable an admin user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $identificationNumber = $this->ask('Enter the identification number:');

        $admin = \Domain\User\Models\User::role('admin')->where('identification_number', $identificationNumber)->first();

        if ($admin) {
            $admin->update(['is_active' => true]);
            $this->info('Admin enabled successfully.');
        } else {
            $this->error('Admin not found.');
        }
    }
}
