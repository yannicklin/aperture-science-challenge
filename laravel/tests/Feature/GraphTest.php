<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Nuwave\Lighthouse\Testing\ClearsSchemaCache;
use Tests\TestCase;
use App\Models\Subject;

class GraphTest extends TestCase
{
    /**
     * Create subject model and test graphql.
     *
     * @return void
     */

    public function test_create_query_destroy_subject(): void
    {
        $subject = Subject::factory()->create();
        // $this->testUserId = $subject->id;
        $response = $this->graphQL(/** @lang GraphQL */ '
            {
                subject(id: '.$subject->id.') {
                    name
                }
            }
        ')->assertJson([
            'data' => [
                'subject' => [
                    'name' => $subject->name,
                ],
            ],
        ]);

        $response = $this->graphQL(/** @lang GraphQL */ '
            mutation {
                deleteSubject(id: '.$subject->id.') {
                    name
                }
            }
        ')->assertJson([
            'data' => [
                'deleteSubject' => [
                    'name' => $subject->name,
                ],
            ],
        ]);
    }

    /**
     * Try to query Users, be rejected.
     *
     * @return void
     */

    public function testQueryUsersProtected(): void
    {
        $response = $this->graphQL(/** @lang GraphQL */ '
            {
                users {
                    data {
                        name
                    }
                }
            }
        ')->decodeResponseJson();

        $message = array_shift(json_decode($response->json)->errors)->message;
        $this->assertEquals($message, "Unauthenticated.");
    }
}