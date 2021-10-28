<?php

namespace Database\Factories;

use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectFactory extends Factory
{
    use SoftDeletes;
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Subject::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'test_chamber' => $this->faker->numberBetween(1, 20),
            'date_of_birth' => $this->faker->dateTimeThisCentury(),
            'score' => $this->faker->numberBetween(0, 100),
            'alive' => $this->faker->boolean()
        ];
    }
}
