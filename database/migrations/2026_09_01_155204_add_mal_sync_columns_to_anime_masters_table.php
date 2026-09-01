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
            $table->integer('mal_rank')
                ->nullable()
                ->index();

            $table->timestampTz('mal_synced_at')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('anime_masters', function (Blueprint $table) {
            $table->dropIndex(['mal_rank']);

            $table->dropColumn([
                'mal_rank',
                'mal_synced_at',
            ]);
        });
    }
};
