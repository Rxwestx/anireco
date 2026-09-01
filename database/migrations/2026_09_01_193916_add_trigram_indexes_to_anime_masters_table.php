<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement(
            'CREATE INDEX anime_masters_title_trgm_index
            ON anime_masters
            USING GIN (title gin_trgm_ops)'
        );

        DB::statement(
            'CREATE INDEX anime_masters_title_en_trgm_index
            ON anime_masters
            USING GIN (title_en gin_trgm_ops)'
        );

        DB::statement(
            'CREATE INDEX anime_masters_title_romaji_trgm_index
            ON anime_masters
            USING GIN (title_romaji gin_trgm_ops)'
        );


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(
            'DROP INDEX IF EXISTS anime_masters_title_trgm_index'
        );
        DB::statement(
            'DROP INDEX IF EXISTS anime_masters_title_en_trgm_index'
        );
        DB::statement(
            'DROP INDEX IF EXISTS anime_masters_title_romaji_trgm_index'
        );
    }
};
