<?php

namespace Database\Seeders;

use Domain\Class\Models\GradeApprovalRequest;
use Illuminate\Database\Seeder;

class GradeApprovalRequestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $req = GradeApprovalRequest::make();

        $req->section()->associate(1);

        $req->instructor()->associate(3);

        $req->reviewer()->associate(1);

        $req->save();
    }
}
