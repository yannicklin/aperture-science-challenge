<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;

class AuthTest extends TestCase
{
    /**
     * Test login functionality.
     *
     * @return void
     */

    public function test_it_rejects_fake_credentials(): void
    {
        $user = User::factory()->make();

        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->post('/login', [
            'email' => $user->email,
            'password' => 'notpassword'
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'message' => 'The given data was invalid.',
            'errors' => [
                'email' => [
                    'These credentials do not match our records.'
                ]
            ]
        ]);
    }
    
    public function test_it_accepts_real_credentials_and_returns_cookie(): void
    {
        $user = User::factory()->create();

        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->post('/login', [
            'email' => $user->email,
            'password' => 'password'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'two_factor' => false
        ]);
        $response->assertCookie('XSRF-TOKEN');
        $response->assertCookie('laravel_session');
    }

    public function test_it_logs_user_out_with_cookie(): void
    {
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->withCookies([
            'XSRF-TOKEN' => "abc"
        ])->post('/logout');

        $response->assertStatus(204);
    }
}