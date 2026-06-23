<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouse_docs', function (Blueprint $table) {
            $table->id();
            $table->string('doc_no')->unique();
            $table->string('type');
            $table->foreignId('supplier_id')->nullable()->constrained();
            $table->string('party')->nullable();
            $table->string('status')->default('posted');
            $table->decimal('total_sum', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_docs');
    }
};
