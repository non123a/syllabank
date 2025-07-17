<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ListAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all admin users.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $users = \Domain\User\Models\User::role('admin')->get();

        $this->table(['ID', 'Name', 'Email'], $users->map(function ($user) {
            return [$user->identification_number, $user->name, $user->email];
        }));
    }
}
