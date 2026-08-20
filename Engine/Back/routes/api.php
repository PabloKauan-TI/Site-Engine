<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\MemberController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserController;
use Laravel\Roster\Console\ScanCommand;


        Route::post('users/login', [UserController::class, 'login'])->withoutMiddleware(['auth:sanctum']);
        Route::post('users/logout', [UserController::class, 'logout'])->withoutMiddleware(['auth:sanctum']);
        Route::get('users', [UserController::class, 'index'])->withoutMiddleware(['auth:sanctum']);
        Route::post('users', [UserController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
        Route::get('users/{id}', [UserController::class, 'show'])->withoutMiddleware(['auth:sanctum']);
        Route::put('users/{id}', [UserController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::patch('users/{id}', [UserController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::delete('users/{id}', [UserController::class, 'destroy'])->withoutMiddleware(['auth:sanctum']);

        Route::post('members/import-csv', [MemberController::class, 'importCsv'])->withoutMiddleware(['auth:sanctum']);
        Route::post('members', [MemberController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
        Route::post('members/{id}', [MemberController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::put('members/{id}', [MemberController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::patch('members/{id}', [MemberController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::delete('members/{id}', [MemberController::class, 'destroy'])->withoutMiddleware(['auth:sanctum']);

        Route::post('projects', [ProjectController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
        Route::post('projects/{id}', [ProjectController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::put('projects/{id}', [ProjectController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::patch('projects/{id}', [ProjectController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::delete('projects/{id}', [ProjectController::class, 'destroy'])->withoutMiddleware(['auth:sanctum']);

        Route::post('publications', [PublicationController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
        Route::post('publications/{id}', [PublicationController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::put('publications/{id}', [PublicationController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::patch('publications/{id}', [PublicationController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::delete('publications/{id}', [PublicationController::class, 'destroy'])->withoutMiddleware(['auth:sanctum']);

        Route::post('news', [NewsController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
        Route::post('news/{id}', [NewsController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::put('news/{id}', [NewsController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::patch('news/{id}', [NewsController::class, 'update'])->withoutMiddleware(['auth:sanctum']);
        Route::delete('news/{id}', [NewsController::class, 'destroy'])->withoutMiddleware(['auth:sanctum']);

        Route::get('members', [MemberController::class, 'index']);
        Route::get('members/{id}', [MemberController::class, 'show']);
        Route::get('projects', [ProjectController::class, 'index']);
        Route::get('projects/{id}', [ProjectController::class, 'show']);
        Route::get('publications', [PublicationController::class, 'index']);
        Route::get('publications/{id}', [PublicationController::class, 'show']);
        Route::get('news', [NewsController::class, 'index']);
        Route::get('news/{id}', [NewsController::class, 'show']);
