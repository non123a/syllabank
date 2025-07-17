<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DisableAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:disable';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Disable an admin user.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $identificationNumber = $this->ask('Enter the identification number:');

        $admin = \Domain\User\Models\User::role('admin')->where('identification_number', $identificationNumber)->first();

        if ($admin) {
            $admin->update(['is_active' => false]);
            $this->info('Admin disabled successfully.');
        } else {
            $this->error('Admin not found.');
        }
    }
}
