<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('patients')->insert([
            ['card_no' => '2230', 'first_name' => 'Алишер', 'last_name' => 'Мирзаев', 'middle_name' => 'Бахтиярович', 'gender' => 'male', 'date_of_birth' => '1985-03-15', 'phone' => '+998901234567', 'email' => 'alisher@example.com', 'source' => 'Instagram', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2231', 'first_name' => 'Озода', 'last_name' => 'Мансурова', 'middle_name' => null, 'gender' => 'female', 'date_of_birth' => '1990-07-22', 'phone' => '+998901234568', 'email' => null, 'source' => 'Рекомендация', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2232', 'first_name' => 'Бахром', 'last_name' => 'Тураев', 'middle_name' => 'Акрамович', 'gender' => 'male', 'date_of_birth' => '1978-11-03', 'phone' => '+998901234569', 'email' => 'bakhrom@example.com', 'source' => 'Сайт', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2233', 'first_name' => 'Нигора', 'last_name' => 'Каримова', 'middle_name' => null, 'gender' => 'female', 'date_of_birth' => '1995-01-10', 'phone' => '+998901234570', 'email' => null, 'source' => 'Telegram', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2234', 'first_name' => 'Шохрух', 'last_name' => 'Абдуллаев', 'middle_name' => 'Баходирович', 'gender' => 'male', 'date_of_birth' => '1988-09-28', 'phone' => '+998901234571', 'email' => 'shokhrukh@example.com', 'source' => 'WhatsApp', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2235', 'first_name' => 'Мадина', 'last_name' => 'Юлдашева', 'middle_name' => null, 'gender' => 'female', 'date_of_birth' => '2000-05-17', 'phone' => '+998901234572', 'email' => null, 'source' => 'Instagram', 'status' => 'new', 'created_at' => now(), 'updated_at' => now()],
            ['card_no' => '2236', 'first_name' => 'Жасур', 'last_name' => 'Эргашев', 'middle_name' => 'Олимович', 'gender' => 'male', 'date_of_birth' => '1975-12-01', 'phone' => '+998901234573', 'email' => 'jasur@example.com', 'source' => 'Звонок', 'status' => 'inactive', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
