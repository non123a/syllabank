<?php

namespace App\Console\Commands;

use Domain\User\DataTransferObjects\RegisterAdminData;
use Domain\User\Mails\GeneratedPasswordMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $identificationNumber = $this->ask('Enter the identification number:');
        $name = $this->ask('Enter the name:');
        $email = $this->ask('Enter the email:');
        $proceed = $this->confirm('Are you sure?');

        if (!$proceed) {
            return $this->error('Operation aborted!');
        }

        $validated = RegisterAdminData::from([
            'identification' => $identificationNumber,
            'name' => $name,
            'email' => $email,
        ]);

        $user = \Domain\User\Models\User::create([
            'identification_number' => $validated->identification,
            'name' => $validated->name,
            'email' => $validated->email,
            'password' => Hash::make($generatedPassword = Str::random(8)),
        ]);

        $user->assignRole('super-admin');

        // send email to user with password

        Mail::to($user->email)->send(new GeneratedPasswordMail($user, $generatedPassword));

        $this->info('User created successfully!');
    }
}