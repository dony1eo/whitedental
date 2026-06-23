<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('services')->insert([
            ['name' => 'Консультация врача', 'category' => 'Консультация', 'price' => 50000, 'doctor_pct' => 30, 'duration' => 30, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Лечение кариеса', 'category' => 'Терапия', 'price' => 150000, 'doctor_pct' => 35, 'duration' => 45, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Лечение пульпита', 'category' => 'Эндодонтия', 'price' => 350000, 'doctor_pct' => 35, 'duration' => 60, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Удаление зуба', 'category' => 'Хирургия', 'price' => 200000, 'doctor_pct' => 30, 'duration' => 30, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Профессиональная чистка', 'category' => 'Гигиена', 'price' => 250000, 'doctor_pct' => 25, 'duration' => 60, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Установка пломбы', 'category' => 'Терапия', 'price' => 120000, 'doctor_pct' => 35, 'duration' => 45, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Коронка металлокерамическая', 'category' => 'Ортопедия', 'price' => 1800000, 'doctor_pct' => 30, 'duration' => 90, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Имплант (1 единица)', 'category' => 'Имплантология', 'price' => 8000000, 'doctor_pct' => 25, 'duration' => 120, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Отбеливание зубов', 'category' => 'Эстетика', 'price' => 1500000, 'doctor_pct' => 20, 'duration' => 90, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Рентген-снимок', 'category' => 'Диагностика', 'price' => 30000, 'doctor_pct' => 10, 'duration' => 15, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Анестезия', 'category' => 'Терапия', 'price' => 20000, 'doctor_pct' => 10, 'duration' => 5, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Брекет-система (1 челюсть)', 'category' => 'Ортодонтия', 'price' => 6000000, 'doctor_pct' => 25, 'duration' => 120, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Шинирование зубов', 'category' => 'Пародонтология', 'price' => 500000, 'doctor_pct' => 30, 'duration' => 60, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Винир керамический', 'category' => 'Эстетика', 'price' => 2500000, 'doctor_pct' => 25, 'duration' => 90, 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
