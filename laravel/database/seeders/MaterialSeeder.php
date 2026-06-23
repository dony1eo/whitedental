<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MaterialSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('materials')->insert([
            ['name' => 'Ультракаин Д-С', 'category' => 'Анестетики', 'stock' => 50, 'min_stock' => 20, 'unit' => 'карп.', 'price' => 12000, 'supplier_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Стеклоиономерный цемент', 'category' => 'Цементы', 'stock' => 8, 'min_stock' => 10, 'unit' => 'уп.', 'price' => 85000, 'supplier_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Композит Filtek Z550', 'category' => 'Пломбы', 'stock' => 15, 'min_stock' => 5, 'unit' => 'шпр.', 'price' => 145000, 'supplier_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Эндодонтический файл', 'category' => 'Эндодонтия', 'stock' => 30, 'min_stock' => 15, 'unit' => 'уп.', 'price' => 65000, 'supplier_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Силиконовый слепок', 'category' => 'Слепки', 'stock' => 12, 'min_stock' => 8, 'unit' => 'уп.', 'price' => 95000, 'supplier_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Имплант Osstem', 'category' => 'Импланты', 'stock' => 4, 'min_stock' => 5, 'unit' => 'шт', 'price' => 2500000, 'supplier_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Перчатки нитриловые', 'category' => 'СИЗ', 'stock' => 3, 'min_stock' => 20, 'unit' => 'уп.', 'price' => 25000, 'supplier_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Брекеты металлические', 'category' => 'Ортодонтия', 'stock' => 20, 'min_stock' => 10, 'unit' => 'компл.', 'price' => 3500000, 'supplier_id' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
