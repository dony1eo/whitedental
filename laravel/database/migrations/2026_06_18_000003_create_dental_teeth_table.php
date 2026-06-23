<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dental_teeth', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->integer('tooth_no');
            $table->string('status')->default('healthy');
            $table->text('notes')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->unique(['patient_id', 'tooth_no']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dental_teeth');
    }
};
