<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WaitlistSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('waitlist')->insert([
            ['patient_name' => 'Исмаилов Рустам', 'phone' => '+998941110001', 'desired_doctor' => 'Солиева Феруза', 'date_window' => '20–25 июня', 'priority' => 'high', 'created_at' => now(), 'updated_at' => now()],
            ['patient_name' => 'Ахмедова Сабина', 'phone' => '+998941110002', 'desired_doctor' => null, 'date_window' => '22–28 июня', 'priority' => 'medium', 'created_at' => now(), 'updated_at' => now()],
            ['patient_name' => 'Холматов Азиз', 'phone' => '+998941110003', 'desired_doctor' => 'Рахимов Санжар', 'date_window' => '25–30 июня', 'priority' => 'low', 'created_at' => now(), 'updated_at' => now()],
            ['patient_name' => 'Норбекова Динара', 'phone' => '+998941110004', 'desired_doctor' => 'Юсупова Нилуфар', 'date_window' => '1–5 июля', 'priority' => 'high', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
