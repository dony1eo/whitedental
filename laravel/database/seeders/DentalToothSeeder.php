<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DentalToothSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('dental_teeth')->insert([
            ['patient_id' => 1, 'tooth_no' => 11, 'status' => 'filling', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 14, 'status' => 'caries', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 16, 'status' => 'crown', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 21, 'status' => 'healthy', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 26, 'status' => 'endo', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 36, 'status' => 'missing', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 37, 'status' => 'implant', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 46, 'status' => 'filling', 'updated_at' => now()],
            ['patient_id' => 1, 'tooth_no' => 47, 'status' => 'caries', 'updated_at' => now()],
        ]);
    }
}
