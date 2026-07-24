<?php

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

        // ユーザーアニメ登録用route
    Route::post('/user-animes', [UserAnimeController::class, 'store'])
    ->name('user-animes.store');

    Route::patch('/user-animes/{userAnime}', [UserAnimeController::class, 'update'])
        ->name('user-animes.update');

    // 感情タグ画面Route
    Route::get('/emotion-tags', function () {
        return inertia('emotion-tags');
    })->name('emotion-tags.index');
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



