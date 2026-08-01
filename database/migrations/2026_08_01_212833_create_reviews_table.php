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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_anime_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->smallInteger('evaluation')
                ->nullable();

            $table->check(
                'evaluation IS NULL OR evaluation BETWEEN 1 AND 5',
            );

            $table->text('comment')
                ->nullable();

            $table->string('recommend_category')
                ->nullable();

            $table->boolean('publish')
                ->default(false);

            $table->boolean('spoiler')
                ->default(false);

            $table->boolean('is_hidden_by_admin')
                ->default(false);
                
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
