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
        Schema::create('user_anime_tags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_anime_id')
            ->constrained('user_animes')
            ->cascadeOnDelete();

            $table->foreignId('emotion_tag_id')
            ->constrained('emotion_tags')
            ->cascadeOnDelete();

            $table->timestamps();

            $table->unique([
                'user_anime_id',
                'emotion_tag_id',
                ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_anime_tags');
    }
};
