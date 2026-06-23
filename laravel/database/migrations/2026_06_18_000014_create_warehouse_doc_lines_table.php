<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouse_doc_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doc_id')->constrained('warehouse_docs')->cascadeOnDelete();
            $table->foreignId('material_id')->constrained();
            $table->decimal('qty', 10, 2);
            $table->decimal('price', 12, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouse_doc_lines');
    }
};
