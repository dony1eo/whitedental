<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained();
            $table->foreignId('doctor_id')->constrained('users');
            $table->string('chair')->default('1');
            $table->string('visit_type')->default('treatment');
            $table->string('visit_kind')->default('regular');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->string('status')->default('not_confirmed');
            $table->string('direction')->nullable();
            $table->string('source')->nullable();
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
