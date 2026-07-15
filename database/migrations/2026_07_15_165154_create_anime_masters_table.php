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
        Schema::create('anime_masters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('anilist_id')->unique();
            $table->string('title');
            $table->string('cover_image')->nullable();
            $table->text('description')->nullable();
            $table->string('genre')->nullable();
            $table->string('broadcast_year')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anime_masters');
    }
};
