<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CashboxEntrySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cashbox_entries')->insert([
            ['operation' => 'Приём пациента Мирзаев А.', 'method' => 'cash', 'amount' => 150000, 'is_income' => true, 'patient_id' => 1, 'created_at' => now()->subDays(3), 'updated_at' => now()],
            ['operation' => 'Приём пациента Мансурова О.', 'method' => 'card', 'amount' => 250000, 'is_income' => true, 'patient_id' => 2, 'created_at' => now()->subDays(2), 'updated_at' => now()],
            ['operation' => 'Закупка материалов', 'method' => 'card', 'amount' => 500000, 'is_income' => false, 'patient_id' => null, 'created_at' => now()->subDays(1), 'updated_at' => now()],
            ['operation' => 'Приём пациента Тураев Б.', 'method' => 'cash', 'amount' => 350000, 'is_income' => true, 'patient_id' => 3, 'created_at' => now()->subDays(1), 'updated_at' => now()],
            ['operation' => 'Аренда помещения', 'method' => 'bank', 'amount' => 2000000, 'is_income' => false, 'patient_id' => null, 'created_at' => now()->subDays(1), 'updated_at' => now()],
            ['operation' => 'Приём пациента Каримова Н.', 'method' => 'payme', 'amount' => 120000, 'is_income' => true, 'patient_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['operation' => 'Оплата импланта (частично)', 'method' => 'card', 'amount' => 4000000, 'is_income' => true, 'patient_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['operation' => 'Зарплата ассистента', 'method' => 'cash', 'amount' => 3000000, 'is_income' => false, 'patient_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['operation' => 'Приём пациента Юлдашева М.', 'method' => 'cash', 'amount' => 50000, 'is_income' => true, 'patient_id' => 6, 'created_at' => now(), 'updated_at' => now()],
            ['operation' => 'Коммунальные услуги', 'method' => 'bank', 'amount' => 450000, 'is_income' => false, 'patient_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
