<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('branches')->insert([
            ['name' => 'Главный офис — Мирзо Улугбек', 'address' => 'ул. Мирзо Улугбек, 45', 'is_main' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Филиал — Чиланзар', 'address' => 'ул. Чиланзар, 12', 'is_main' => false, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Филиал — Сергели', 'address' => 'ул. Сергели, 8', 'is_main' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
