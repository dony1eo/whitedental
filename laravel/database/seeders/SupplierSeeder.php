<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('suppliers')->insert([
            ['name' => 'Dental Supply Co.', 'contact' => 'Алексей', 'phone' => '+998901110100', 'category' => 'Материалы', 'balance' => -500000, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'MedImport', 'contact' => 'Елена', 'phone' => '+998901110101', 'category' => 'Импланты', 'balance' => -1200000, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'StomMarket', 'contact' => 'Дмитрий', 'phone' => '+998901110102', 'category' => 'Расходники', 'balance' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'EuroDent', 'contact' => 'Ольга', 'phone' => '+998901110103', 'category' => 'Оборудование', 'balance' => -300000, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'AsiaPharma', 'contact' => 'Рустам', 'phone' => '+998901110104', 'category' => 'Анестетики', 'balance' => -150000, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
