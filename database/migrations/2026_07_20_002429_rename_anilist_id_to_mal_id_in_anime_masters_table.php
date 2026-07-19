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
        Schema::table('anime_masters', function (Blueprint $table) {

            $table->renameColumn('anilist_id', 'mal_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anime_masters', function (Blueprint $table) {
            $table->renameColumn('mal_id', 'anilist_id');
        });
    }
};
