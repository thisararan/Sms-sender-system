<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageTemplateController;

// Handle CORS preflight requests
Route::options('/{any}', function () {
    return response('', 200);
})->where('any', '.*');

// Public routes - Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['api'])->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Contacts CRUD
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::post('/contacts', [ContactController::class, 'store']);
    Route::get('/contacts/{id}', [ContactController::class, 'show']);
    Route::put('/contacts/{id}', [ContactController::class, 'update']);
    Route::delete('/contacts/{id}', [ContactController::class, 'destroy']);
    
    // Messages CRUD
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::post('/messages/send', [MessageController::class, 'send']);
    Route::get('/messages/{id}', [MessageController::class, 'show']);
    Route::put('/messages/{id}', [MessageController::class, 'update']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
    
    // Templates CRUD
    Route::get('/templates', [MessageTemplateController::class, 'index']);
    Route::post('/templates', [MessageTemplateController::class, 'store']);
    Route::get('/templates/{id}', [MessageTemplateController::class, 'show']);
    Route::put('/templates/{id}', [MessageTemplateController::class, 'update']);
    Route::delete('/templates/{id}', [MessageTemplateController::class, 'destroy']);
});
