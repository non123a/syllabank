<?php

namespace App\Console\Commands;

use Domain\User\DataTransferObjects\UpdateAdminData;
use Illuminate\Console\Command;

class UpdateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->ask('Enter the ID of the user you want to update:');

        $user = \Domain\User\Models\User::where('identification_number', $userId)->first();

        if (!$user) {
            $this->error('User not found!');

            return;
        }

        $name = $this->ask('Enter the new name:');

        $proceed = $this->confirm('Are you sure you want to update the user?');

        if (!$proceed) {
            return $this->error('Operation aborted!');
        }

        $validated = UpdateAdminData::from([
            'id' => $userId,
            'name' => $name,
        ]);

        $user->update([
            'name' => $validated->name,
        ]);

        $this->info('User updated successfully!');
    }
}
