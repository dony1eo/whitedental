<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            ['name' => 'Админ Системы', 'email' => 'admin@whitedental.uz', 'password' => Hash::make('admin123'), 'role' => 'admin', 'specialty' => null, 'phone' => '+998901110000', 'color' => '#e61b1b', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Солиева Феруза', 'email' => 'feruza@whitedental.uz', 'password' => Hash::make('doctor123'), 'role' => 'doctor', 'specialty' => 'Терапевт', 'phone' => '+998901110001', 'color' => '#0787c9', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Рахимов Санжар', 'email' => 'sanzhar@whitedental.uz', 'password' => Hash::make('doctor123'), 'role' => 'doctor', 'specialty' => 'Хирург', 'phone' => '+998901110002', 'color' => '#1f8a4d', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Юсупова Нилуфар', 'email' => 'nilufar@whitedental.uz', 'password' => Hash::make('doctor123'), 'role' => 'doctor', 'specialty' => 'Ортодонт', 'phone' => '+998901110003', 'color' => '#8e90c8', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Каримов Бехзод', 'email' => 'bekhzod@whitedental.uz', 'password' => Hash::make('doctor123'), 'role' => 'doctor', 'specialty' => 'Ортопед', 'phone' => '+998901110004', 'color' => '#e0a020', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Назарова Дилноза', 'email' => 'dilnoza@whitedental.uz', 'password' => Hash::make('doctor123'), 'role' => 'doctor', 'specialty' => 'Пародонтолог', 'phone' => '+998901110005', 'color' => '#e040c8', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
