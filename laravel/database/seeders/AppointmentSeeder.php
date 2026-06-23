<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $today = now()->toDateString();

        DB::table('appointments')->insert([
            ['patient_id' => 1, 'doctor_id' => 2, 'chair' => '1', 'visit_type' => 'treatment', 'visit_kind' => 'regular', 'start_time' => "$today 09:00:00", 'end_time' => "$today 09:30:00", 'status' => 'confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['patient_id' => 2, 'doctor_id' => 3, 'chair' => '2', 'visit_type' => 'consultation', 'visit_kind' => 'primary', 'start_time' => "$today 10:00:00", 'end_time' => "$today 10:30:00", 'status' => 'arrived', 'created_at' => now(), 'updated_at' => now()],
            ['patient_id' => 3, 'doctor_id' => 4, 'chair' => '3', 'visit_type' => 'treatment', 'visit_kind' => 'planned', 'start_time' => "$today 11:00:00", 'end_time' => "$today 11:45:00", 'status' => 'in_chair', 'created_at' => now(), 'updated_at' => now()],
            ['patient_id' => 4, 'doctor_id' => 5, 'chair' => '1', 'visit_type' => 'treatment', 'visit_kind' => 'regular', 'start_time' => "$today 14:00:00", 'end_time' => "$today 15:00:00", 'status' => 'not_confirmed', 'created_at' => now(), 'updated_at' => now()],
            ['patient_id' => 5, 'doctor_id' => 6, 'chair' => '4', 'visit_type' => 'consultation', 'visit_kind' => 'primary', 'start_time' => "$today 15:00:00", 'end_time' => "$today 15:15:00", 'status' => 'cancelled', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
