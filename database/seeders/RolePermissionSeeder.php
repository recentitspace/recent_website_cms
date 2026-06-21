<?php

namespace Database\Seeders;

use App\Enums\UserType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            // users
            'view users',
            'create users',
            'edit users',
            'delete users',

            // roles
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',

            // organizations
            'view organizations',
            'edit organizations',

            // settings
            'manage settings',

            // reports
            'view reports',

            // logs
            'view logs',

            // dashboard
            'view dashboard',

            // trash
            'view trash items',

            // media
            'view media',
            'upload media',
            'edit media',
            'delete media',

            // site settings
            'manage site settings',

            // social links
            'view social links',
            'create social links',
            'edit social links',
            'delete social links',

            // portfolio categories
            'view portfolio categories',
            'create portfolio categories',
            'edit portfolio categories',
            'delete portfolio categories',

            // portfolio items
            'view portfolio items',
            'create portfolio items',
            'edit portfolio items',
            'delete portfolio items',

            // clients
            'view clients',
            'create clients',
            'edit clients',
            'delete clients',

            // testimonials
            'view testimonials',
            'create testimonials',
            'edit testimonials',
            'delete testimonials',

            // pricing sections
            'view pricing sections',
            'create pricing sections',
            'edit pricing sections',
            'delete pricing sections',

            // pricing plans
            'view pricing plans',
            'create pricing plans',
            'edit pricing plans',
            'delete pricing plans',

            // domain extensions
            'view domain extensions',
            'create domain extensions',
            'edit domain extensions',
            'delete domain extensions',

            // service categories
            'view service categories',
            'create service categories',
            'edit service categories',
            'delete service categories',

            // service items
            'view service items',
            'create service items',
            'edit service items',
            'delete service items',

            // faqs
            'view faqs',
            'create faqs',
            'edit faqs',
            'delete faqs',

            // stat counters
            'view stat counters',
            'create stat counters',
            'edit stat counters',
            'delete stat counters',

            // page blocks
            'view page blocks',
            'create page blocks',
            'edit page blocks',
            'delete page blocks',

            // why choose items
            'view why choose items',
            'create why choose items',
            'edit why choose items',
            'delete why choose items',

            // about drive items
            'view about drive items',
            'create about drive items',
            'edit about drive items',
            'delete about drive items',

            // about objectives
            'view about objectives',
            'create about objectives',
            'edit about objectives',
            'delete about objectives',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->syncPermissions(Permission::all());

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'user_type' => UserType::ADMIN,
            ]
        );

        if (!$adminUser->hasRole('admin')) {
            $adminUser->assignRole('admin');
        }
    }
}
