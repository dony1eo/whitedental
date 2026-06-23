<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('campaigns')->insert([
            ['name' => 'Скидка на чистку', 'channel' => 'telegram', 'group_name' => 'Активные пациенты', 'reach' => 245, 'status' => 'sent', 'sent_at' => now()->subDays(7), 'scheduled_at' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Акция на импланты', 'channel' => 'whatsapp', 'group_name' => 'Пациенты старше 40', 'reach' => 180, 'status' => 'sent', 'sent_at' => now()->subDays(3), 'scheduled_at' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Напоминание о визите', 'channel' => 'sms', 'group_name' => 'Завтрашние визиты', 'reach' => 52, 'status' => 'scheduled', 'sent_at' => null, 'scheduled_at' => now()->addDay(), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Новогодняя акция', 'channel' => 'instagram', 'group_name' => 'Все пациенты', 'reach' => 500, 'status' => 'draft', 'sent_at' => null, 'scheduled_at' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Отбеливание -20%', 'channel' => 'telegram', 'group_name' => 'Молодые пациенты', 'reach' => 310, 'status' => 'sent', 'sent_at' => now()->subDays(14), 'scheduled_at' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
