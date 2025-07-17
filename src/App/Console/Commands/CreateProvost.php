<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Support\Facades\Mail;
// use Illuminate\Support\Str;

class CreateProvost extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'provost:create {name} {email} {identification_number}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new provost in the system.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $provost = \Domain\User\Models\User::create([
            'name' => $this->argument('name'),
            'email' => $this->argument('email'),
            'identification_number' => $this->argument('identification_number'),
            'password' => Hash::make($password = 'password'),
        ]);

        $provost->assignRole('provost');

        // Mail::to($provost)->send(new \Domain\User\Mails\GeneratedPasswordMail($provost, 'password'));

        $this->info('Provost created successfully.');
    }
}
