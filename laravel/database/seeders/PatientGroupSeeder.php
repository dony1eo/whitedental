<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientGroupSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('patient_groups')->insert([
            ['name' => 'Активные пациенты', 'condition' => 'visits > 3', 'color' => '#0787c9', 'count' => 85, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Новые пациенты', 'condition' => 'created in last 30 days', 'color' => '#1f8a4d', 'count' => 23, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Пациенты с долгами', 'condition' => 'balance < 0', 'color' => '#e61b1b', 'count' => 12, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ортодонтические пациенты', 'condition' => 'has orthodontic treatment', 'color' => '#8e90c8', 'count' => 34, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'VIP пациенты', 'condition' => 'total spent > 10M', 'color' => '#e0a020', 'count' => 8, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Детские пациенты', 'condition' => 'age < 18', 'color' => '#e040c8', 'count' => 42, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
