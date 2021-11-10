<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Subject;

class ModelTest extends TestCase
{
    /**
     * Create user and subject classes
     *
     * @return void
     */
    public function test_models_can_be_instantiated()
    {
        $user = User::factory()->make(['name' => 'Joe Bloggs']);
        $subject = Subject::factory()->make(['name' => 'Joe Bloggs']);

        $this->assertInstanceOf(Subject::class, $subject);
        $this->assertInstanceOf(User::class, $user);
    }
}
