<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_animes', function (Blueprint $table) {
            $table->id()->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('anime_master_id')->constrained();
            $table->string('status');
            $table->timestamps();
            $table->unique(['user_id', 'anime_master_id']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_animes');
    }
};
