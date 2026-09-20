<?php

use App\Http\Controllers\Api\V1\BirthdayController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => response()->json([
        'status' => 'ok',
        'service' => 'yadeto-api',
        'version' => '2.2.4',
    ]));

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::apiResource('birthdays', BirthdayController::class);
    });
});
