<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    // 検索用route
    Route::get('/search',function () {
        return inertia('search');
    })->name('search');

    // 管理者用route
    // Route::prefix('admin')
    // ->name('admin.')
    // ->middleware('admin')
    // ->group(function () {
    //     Route::get('/dashboard', [AdminDashboardController::class, 'index'])
    //         ->name('dashboard');
    // });
});


require __DIR__.'/settings.php';


//
