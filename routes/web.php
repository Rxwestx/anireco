<?php
use App\Http\Controllers\DashboardController;
// use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// 検索用route
Route::get('/search',function () {
    return inertia('search');
})->name('search');

// ログイン・メール認証済みユーザー用Route
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

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



