<?php

use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WatchNoteController;
use App\Http\Controllers\UserAnimeTagController;
use App\Http\Controllers\EmotionTagController;
use App\Http\Controllers\AnimeController;
use App\Http\Controllers\AnimeSearchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserAnimeController;
// use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// 公開：検索用route
Route::get('/search', [AnimeSearchController::class, 'index'])
    ->name('anime.search');

// 公開：アニメ詳細画面route
Route::get('/animes/{malId}', [AnimeController::class, 'show'])
    ->name('anime.show');

// ログイン・メール認証済みユーザー用Route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // 作品登録用route
    Route::post('/user-animes', [UserAnimeController::class, 'store'])
        ->name('user-animes.store');

    Route::patch(
        '/user-animes/{userAnime}',
        [UserAnimeController::class, 'update']
    )->name('user-animes.update');

    // 視聴メモ登録用route
    Route::post(
        '/user-animes/{userAnime}/watch-notes',
        [WatchNoteController::class, 'store']
    )->name('watch-notes.store');

    // 視聴メモ更新用route
    Route::patch(
        '/user-animes/{userAnime}/watch-notes/{watchNote}',
        [WatchNoteController::class, 'update']
    )->name('watch-notes.update');

    // 視聴メモ削除用route
    Route::delete(
        '/user-animes/{userAnime}/watch-notes/{watchNote}',
        [WatchNoteController::class, 'destroy']
    )->name('watch-notes.destroy');

    // レビュー登録用route
    Route::post(
        '/user-animes/{userAnime}/reviews',
        [ReviewController::class, 'store']
    )->name('reviews.store');

    // レビュー更新用route
    Route::patch(
        '/user-animes/{userAnime}/reviews/{review}',
        [ReviewController::class, 'update']
    )->name('reviews.update');

    // レビュー削除用route
    Route::delete(
        '/user-animes/{userAnime}/reviews/{review}',
        [ReviewController::class, 'destroy']
    )->name('reviews.destroy');

    // 感情タグ画面Route
    Route::get('/emotion-tags', [EmotionTagController::class, 'index'])
        ->name('emotion-tags.index');

    Route::post('/emotion-tags', [EmotionTagController::class, 'store'])
        ->name('emotion-tags.store');

    Route::patch(
        '/emotion-tags/{emotionTag}',
        [EmotionTagController::class, 'update']
    )->name('emotion-tags.update');

    Route::delete(
        '/emotion-tags/{emotionTag}',
        [EmotionTagController::class, 'destroy']
    )->name('emotion-tags.destroy');

    // ユーザーアニメ感情タグ登録用route
    Route::post(
        '/user-animes/{userAnime}/emotion-tags',
        [UserAnimeTagController::class, 'store']
    )->name('user-anime-tags.store');

    // ユーザーアニメ感情タグ解除用route
    Route::delete(
        '/user-animes/{userAnime}/emotion-tags/{emotionTag}',
        [UserAnimeTagController::class, 'destroy']
    )->name('user-anime-tags.destroy');
});

    // 管理者用route
    // Route::prefix('admin')
    // ->name('admin.')
    // ->middleware(['auth', 'verified', 'admin'])
    // ->group(function () {
    //     Route::get('/dashboard', [AdminReviewController::class, 'index'])
    //         ->name('reviews.index');
    // });

require __DIR__.'/settings.php';

