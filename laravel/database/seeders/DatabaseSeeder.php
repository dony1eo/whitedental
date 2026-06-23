<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ServiceSeeder::class,
            PatientSeeder::class,
            SupplierSeeder::class,
            MaterialSeeder::class,
            DentalToothSeeder::class,
            AppointmentSeeder::class,
            LeadSeeder::class,
            CashboxEntrySeeder::class,
            TaskSeeder::class,
            WaitlistSeeder::class,
            CampaignSeeder::class,
            PatientGroupSeeder::class,
            BranchSeeder::class,
        ]);
    }
}
