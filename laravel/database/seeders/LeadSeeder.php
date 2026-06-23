<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeadSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('leads')->insert([
            ['name' => 'Анвар Каримов', 'phone' => '+998931110001', 'source' => 'Instagram', 'stage' => 0, 'potential' => 500000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Гульнара Азизова', 'phone' => '+998931110002', 'source' => 'Сайт', 'stage' => 1, 'potential' => 2000000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ботир Норматов', 'phone' => '+998931110003', 'source' => 'Рекомендация', 'stage' => 1, 'potential' => 800000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Зухра Рахимова', 'phone' => '+998931110004', 'source' => 'Telegram', 'stage' => 2, 'potential' => 1500000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Сардор Юсупов', 'phone' => '+998931110005', 'source' => 'WhatsApp', 'stage' => 2, 'potential' => 3500000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Дилфуза Саидова', 'phone' => '+998931110006', 'source' => 'Instagram', 'stage' => 3, 'potential' => 900000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Фарход Акрамов', 'phone' => '+998931110007', 'source' => 'Сайт', 'stage' => 3, 'potential' => 4200000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Лола Мирзаева', 'phone' => '+998931110008', 'source' => 'Звонок', 'stage' => 4, 'potential' => 6000000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Тимур Хасанов', 'phone' => '+998931110009', 'source' => 'Рекомендация', 'stage' => 4, 'potential' => 2800000, 'curator_id' => 1, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
