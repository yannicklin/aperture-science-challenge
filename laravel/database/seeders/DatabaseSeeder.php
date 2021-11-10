<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // User::factory(5)->create();
        // test user
        DB::table('users')->insert([
            'name' => 'Joe Bloggs',
            'email' => 'foo@foo.com',
            'email_verified_at' => now(),
            'password' => bcrypt('bar'),
            'remember_token' => Str::random(10),
        ]);
    }
}
