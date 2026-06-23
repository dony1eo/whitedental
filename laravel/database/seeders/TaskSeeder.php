<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tasks')->insert([
            ['title' => 'Обзвонить новых лидов', 'assignee_id' => 1, 'priority' => 'high', 'due' => 'today', 'done' => false, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Заказать анестетики', 'assignee_id' => 1, 'priority' => 'high', 'due' => 'today', 'done' => false, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Подготовить отчёт за месяц', 'assignee_id' => 1, 'priority' => 'medium', 'due' => 'tomorrow', 'done' => false, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Обновить прайс-лист', 'assignee_id' => 1, 'priority' => 'low', 'due' => 'week', 'done' => true, 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Проверить оборудование', 'assignee_id' => 2, 'priority' => 'medium', 'due' => 'today', 'done' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
