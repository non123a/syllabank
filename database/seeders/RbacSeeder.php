<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RbacSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'auth:forgot-password']);
        Permission::create(['name' => 'auth:change-password']);

        Permission::create(['name' => 'academic-period:list-all']);
        Permission::create(['name' => 'academic-period:view-all']);
        Permission::create(['name' => 'academic-period:create-all']);
        Permission::create(['name' => 'academic-period:update-all']);
        Permission::create(['name' => 'academic-period:delete-all']);
        Permission::create(['name' => 'academic-period:duplicate-all']);

        Permission::create(['name' => 'class:list-all']);
        Permission::create(['name' => 'class:create-all']);
        Permission::create(['name' => 'class:update-all']);
        Permission::create(['name' => 'class:delete-all']);

        Permission::create(['name' => 'dashboard:view-summary']);

        Permission::create(['name' => 'section:list-all']);
        Permission::create(['name' => 'section:view-all']);
        Permission::create(['name' => 'section:create-all']);
        Permission::create(['name' => 'section:update-all']);
        Permission::create(['name' => 'section:delete-all']);

        Permission::create(['name' => 'section:list-mine']);

        Permission::create(['name' => 'student:grade-report:list-all']);
        Permission::create(['name' => 'student:grade-report:view-all']);

        Permission::create(['name' => 'student:grade-report:view-mine']);

        Permission::create(['name' => 'student:register-all']);
        Permission::create(['name' => 'student:list-all']);
        Permission::create(['name' => 'student:update-all']);
        Permission::create(['name' => 'student:view-all']);
        Permission::create(['name' => 'student:delete-all']);

        Permission::create(['name' => 'section:student:list-all']);
        Permission::create(['name' => 'section:student:view-all']);
        Permission::create(['name' => 'section:student:add-all']);
        Permission::create(['name' => 'section:student:remove-all']);

        Permission::create(['name' => 'section:student:list-mine']);
        Permission::create(['name' => 'section:student:view-mine']);

        Permission::create(['name' => 'section:student-grade:upload-mine']);

        Permission::create(['name' => 'instructor:register-all']);
        Permission::create(['name' => 'instructor:list-all']);
        Permission::create(['name' => 'instructor:view-all']);
        Permission::create(['name' => 'instructor:update-all']);
        Permission::create(['name' => 'instructor:delete-all']);

        Permission::create(['name' => 'hod:register-all']);
        Permission::create(['name' => 'hod:list-all']);
        Permission::create(['name' => 'hod:view-all']);
        Permission::create(['name' => 'hod:update-all']);
        Permission::create(['name' => 'hod:delete-all']);

        Permission::create(['name' => 'dean:register-all']);
        Permission::create(['name' => 'dean:list-all']);
        Permission::create(['name' => 'dean:view-all']);
        Permission::create(['name' => 'dean:update-all']);
        Permission::create(['name' => 'dean:delete-all']);

        Permission::create(['name' => 'schedule:view-mine']);

        Permission::create(['name' => 'grade-submission:list-all']);
        Permission::create(['name' => 'grade-submission:view-all']);
        Permission::create(['name' => 'grade-submission:approve-all']);
        Permission::create(['name' => 'grade-submission:decline-all']);

        Permission::create(['name' => 'admin:create-all']);
        Permission::create(['name' => 'admin:view-all']);
        Permission::create(['name' => 'admin:update-all']);
        Permission::create(['name' => 'admin:delete-all']);
        Permission::create(['name' => 'admin:disable-all']);
        Permission::create(['name' => 'admin:enable-all']);
        Permission::create(['name' => 'admin:list-all']);

        Permission::create(['name' => 'exit-exam:list-all']);
        Permission::create(['name' => 'exit-exam:view-all']);
        Permission::create(['name' => 'exit-exam:update-all']);
        Permission::create(['name' => 'exit-exam:delete-all']);

        Permission::create(['name' => 'grade-summary:list-all']);

        // SyllaBank

        // Student Permissions
        // Permission::create(['name' => 'student:update-profile']);
        Permission::create(['name' => 'student:view-syllabi']);
        Permission::create(['name' => 'student:download-syllabi']);
        Permission::create(['name' => 'student:request-syllabi-access']);

        // Lecturer Permissions
        Permission::create(['name' => 'instructor:create-syllabi']);
        Permission::create(['name' => 'instructor:edit-syllabi']);
        Permission::create(['name' => 'instructor:view-own-syllabi']);
        Permission::create(['name' => 'instructor:submit-syllabi']);
        Permission::create(['name' => 'instructor:delete-draft-syllabi']);

        // Head of Department (HoD) Permissions
        Permission::create(['name' => 'hod:approve-student-requests']);
        Permission::create(['name' => 'hod:review-syllabi']);
        Permission::create(['name' => 'hod:view-department-syllabi']);
        Permission::create(['name' => 'hod:assign-courses']);

        // Dean Permissions
        Permission::create(['name' => 'dean:review-syllabi']);
        Permission::create(['name' => 'dean:approve-syllabi']);
        Permission::create(['name' => 'dean:view-faculty-syllabi']);
        Permission::create(['name' => 'dean:create-courses']);

        Permission::create(['name' => 'provost:accept-syllabi']);
        Permission::create(['name' => 'provost:view-all-syllabi']);
        Permission::create(['name' => 'provost:manage-all-syllabi']);
        Permission::create(['name' => 'provost:set-academic-dates']);

        // System Administrator Permissions
        Permission::create(['name' => 'admin:manage-users']);
        Permission::create(['name' => 'admin:manage-roles']);
        Permission::create(['name' => 'admin:manage-organization']);
        Permission::create(['name' => 'admin:system-configuration']);

        // General Permissions
        Permission::create(['name' => 'syllabi:search']);
        Permission::create(['name' => 'syllabi:filter']);


        $role = Role::create(['name' => 'student']);

        $role->givePermissionTo([
            'student:grade-report:view-mine',
            'schedule:view-mine',
            'auth:change-password',
            'auth:forgot-password',
            'student:view-syllabi',
            'student:download-syllabi',
            'student:request-syllabi-access'
        ]);

        $role = Role::create(['name' => 'instructor'])

            ->givePermissionTo([
                'auth:change-password',
                'auth:forgot-password',
                'instructor:create-syllabi',
                'instructor:edit-syllabi',
                'instructor:view-own-syllabi',
                'instructor:submit-syllabi',
                'instructor:delete-draft-syllabi'
            ]);

        $role = Role::create(['name' => 'hod'])

            ->givePermissionTo([
                'auth:change-password',
                'auth:forgot-password',

                'hod:approve-student-requests',
                'hod:review-syllabi',
                'hod:view-department-syllabi',
                'hod:assign-courses'
            ]);

        $role = Role::create(['name' => 'dean']);

        $role->givePermissionTo([
            'dean:review-syllabi',
            'dean:approve-syllabi',
            'dean:view-faculty-syllabi',
            'dean:create-courses'
        ]);

        $role = Role::create(['name' => 'provost']);

        $role->givePermissionTo([
            'provost:accept-syllabi',
            'provost:view-all-syllabi',
            'provost:manage-all-syllabi',
            'provost:set-academic-dates',

            'auth:change-password',
            'auth:forgot-password',
        ]);

        $role = Role::create(['name' => 'super-admin']);

        $role->givePermissionTo([

            'admin:create-all',
            'admin:list-all',
            'admin:view-all',
            'admin:update-all',
            'admin:delete-all',
            'admin:disable-all',
            'admin:enable-all',

            'student:register-all',
            'student:list-all',
            'student:update-all',
            'student:view-all',
            'student:delete-all',

            'instructor:register-all',
            'instructor:list-all',
            'instructor:update-all',
            'instructor:view-all',
            'instructor:delete-all',

            'hod:register-all',
            'hod:list-all',
            'hod:update-all',
            'hod:view-all',
            'hod:delete-all',

            'dean:register-all',
            'dean:list-all',
            'dean:update-all',
            'dean:view-all',
            'dean:delete-all',

            'admin:manage-users',
            'admin:manage-roles',
            'admin:manage-organization',
            'admin:system-configuration'
        ]);
    }
}
