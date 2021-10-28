<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class UserTest extends TestCase
{
    /**
     * Create user class
     *
     * @return void
     */
    public function test_models_can_be_instantiated()
    {
        $user = User::factory()->make();
        // var_dump($user);
        // $this->assertClassHasAttribute('name', User::class);
        $this->assertTrue(true);
    }

    // public function test_user_create()
    // {
    //     $user = User::factory(1)->create();
    //     // var_dump($user);
    //     $this->assertDatabaseHas('users', [
    //         'email' => 'sally@example.com',
    //     ]);
    // }
}
