<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetDoctorPasswords extends Command
{
    protected $signature = 'db:reset-doctor-passwords {--password=password123}';
    protected $description = 'Reset password for all users with role=doctor (defaults to password123)';

    public function handle(): int
    {
        $password = (string) $this->option('password');
        if ($password === '') {
            $this->error('Password cannot be empty.');
            return self::FAILURE;
        }

        $hash = Hash::make($password);
        $now = now();

        $count = DB::table('users')
            ->where('role', 'doctor')
            ->update([
                'password'   => $hash,
                'updated_at' => $now,
            ]);

        $this->info(sprintf('Reset password for %d doctor(s) to "%s".', $count, $password));
        return self::SUCCESS;
    }
}