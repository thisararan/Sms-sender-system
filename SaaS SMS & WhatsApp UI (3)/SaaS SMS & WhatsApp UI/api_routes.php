<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\MessageTemplateController;
use App\Http\Controllers\ScheduledMessageController;
use App\Http\Controllers\MessageLogController;
use App\Http\Controllers\APIConfigController;
use App\Http\Controllers\SystemLogController;
use App\Models\Contact;
use App\Models\MessageLog;
use App\Models\ScheduledMessage;

// Health check - No auth required
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'message' => 'MessageHub API is running'
    ]);
});

// API Routes Group
Route::middleware(['api'])->group(function () {
    // Contact Management Routes
    Route::apiResource('contacts', ContactController::class);
    Route::post('contacts/bulk-import', [ContactController::class, 'bulkImport']);
    Route::post('contacts/bulk-delete', [ContactController::class, 'bulkDelete']);
    Route::get('contacts/export', [ContactController::class, 'export']);

    // Message Routes
    Route::apiResource('messages', MessageController::class);
    Route::post('messages/send', [MessageController::class, 'send']);
    Route::get('messages/search', [MessageController::class, 'search']);
    Route::post('messages/bulk-send', [MessageController::class, 'bulkSend']);

    // Message Template Routes
    Route::apiResource('templates', MessageTemplateController::class);
    Route::get('templates/search', [MessageTemplateController::class, 'search']);
    Route::post('templates/duplicate/{id}', [MessageTemplateController::class, 'duplicate']);

    // Scheduled Message Routes
    Route::apiResource('scheduled', ScheduledMessageController::class);
    Route::post('scheduled/{id}/execute', [ScheduledMessageController::class, 'execute']);
    Route::get('scheduled/status', [ScheduledMessageController::class, 'statusList']);

    // Message Log Routes
    Route::get('logs', [MessageLogController::class, 'index']);
    Route::get('logs/{id}', [MessageLogController::class, 'show']);
    Route::get('logs/filter', [MessageLogController::class, 'filter']);
    Route::delete('logs/bulk-delete', [MessageLogController::class, 'bulkDelete']);

    // API Configuration Routes
    Route::apiResource('config', APIConfigController::class);
    Route::post('config/test-sms', [APIConfigController::class, 'testSMS']);
    Route::post('config/test-whatsapp', [APIConfigController::class, 'testWhatsApp']);

    // System Logs Routes
    Route::get('system-logs', [SystemLogController::class, 'index']);
    Route::get('system-logs/{id}', [SystemLogController::class, 'show']);
    Route::delete('system-logs/{id}', [SystemLogController::class, 'destroy']);
    Route::post('system-logs/clear-old', [SystemLogController::class, 'clearOldLogs']);

    // Dashboard Statistics
    Route::get('dashboard/stats', function () {
        $totalContacts = Contact::count() ?: 0;
        $totalMessages = MessageLog::count() ?: 0;
        $scheduledMessages = ScheduledMessage::count() ?: 0;
        $deliveredMessages = MessageLog::where('status', 'delivered')->count() ?: 0;

        return response()->json([
            'success' => true,
            'data' => [
                [
                    'title' => 'Total Messages',
                    'value' => (string)$totalMessages,
                    'change' => '+12%',
                    'icon' => 'MessageSquare',
                    'color' => 'text-blue-600',
                    'bgColor' => 'bg-blue-100'
                ],
                [
                    'title' => 'Scheduled',
                    'value' => (string)$scheduledMessages,
                    'change' => '+5%',
                    'icon' => 'Clock',
                    'color' => 'text-yellow-600',
                    'bgColor' => 'bg-yellow-100'
                ],
                [
                    'title' => 'Delivered',
                    'value' => (string)$deliveredMessages,
                    'change' => '+8%',
                    'icon' => 'CheckCircle',
                    'color' => 'text-green-600',
                    'bgColor' => 'bg-green-100'
                ],
                [
                    'title' => 'Total Contacts',
                    'value' => (string)$totalContacts,
                    'change' => '+2%',
                    'icon' => 'Users',
                    'color' => 'text-purple-600',
                    'bgColor' => 'bg-purple-100'
                ]
            ]
        ]);
    });

    Route::get('dashboard/charts', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'message_trend' => [
                    ['name' => 'Mon', 'sms' => 120],
                    ['name' => 'Tue', 'sms' => 180],
                    ['name' => 'Wed', 'sms' => 150],
                    ['name' => 'Thu', 'sms' => 220],
                    ['name' => 'Fri', 'sms' => 280],
                    ['name' => 'Sat', 'sms' => 190],
                    ['name' => 'Sun', 'sms' => 140],
                ],
                'success_rate' => [
                    ['name' => 'Jan', 'rate' => 94],
                    ['name' => 'Feb', 'rate' => 96],
                    ['name' => 'Mar', 'rate' => 95],
                    ['name' => 'Apr', 'rate' => 97],
                    ['name' => 'May', 'rate' => 98],
                    ['name' => 'Jun', 'rate' => 96],
                ]
            ]
        ]);
    });

    // Webhook Routes (for SMS/WhatsApp providers)
    Route::post('webhooks/sms-delivery', function (Request $request) {
        // Handle SMS delivery status updates
        return response()->json(['success' => true, 'message' => 'SMS webhook received']);
    });

    Route::post('webhooks/whatsapp-delivery', function (Request $request) {
        // Handle WhatsApp delivery status updates
        return response()->json(['success' => true, 'message' => 'WhatsApp webhook received']);
    });
});

// System Logs Routes
Route::get('system-logs', [SystemLogController::class, 'index']);
Route::get('system-logs/{id}', [SystemLogController::class, 'show']);
Route::delete('system-logs/{id}', [SystemLogController::class, 'destroy']);
Route::post('system-logs/clear-old', [SystemLogController::class, 'clearOldLogs']);

// Dashboard Statistics
Route::get('dashboard/stats', function () {
    $totalContacts = Contact::count() ?: 0;
    $totalMessages = MessageLog::count() ?: 0;
    $scheduledMessages = ScheduledMessage::count() ?: 0;
    $deliveredMessages = MessageLog::where('status', 'delivered')->count() ?: 0;

    return response()->json([
        'success' => true,
        'data' => [
            [
                'title' => 'Total Messages',
                'value' => (string)$totalMessages,
                'change' => '+12%',
                'icon' => 'MessageSquare',
                'color' => 'text-blue-600',
                'bgColor' => 'bg-blue-100'
            ],
            [
                'title' => 'Scheduled',
                'value' => (string)$scheduledMessages,
                'change' => '+5%',
                'icon' => 'Clock',
                'color' => 'text-yellow-600',
                'bgColor' => 'bg-yellow-100'
            ],
            [
                'title' => 'Delivered',
                'value' => (string)$deliveredMessages,
                'change' => '+8%',
                'icon' => 'CheckCircle',
                'color' => 'text-green-600',
                'bgColor' => 'bg-green-100'
            ],
            [
                'title' => 'Total Contacts',
                'value' => (string)$totalContacts,
                'change' => '+2%',
                'icon' => 'Users',
                'color' => 'text-purple-600',
                'bgColor' => 'bg-purple-100'
            ]
        ]
    ]);
});

Route::get('dashboard/charts', function () {
    return response()->json([
        'success' => true,
        'data' => [
            'message_trend' => [
                ['name' => 'Mon', 'sms' => 120],
                ['name' => 'Tue', 'sms' => 180],
                ['name' => 'Wed', 'sms' => 150],
                ['name' => 'Thu', 'sms' => 220],
                ['name' => 'Fri', 'sms' => 280],
                ['name' => 'Sat', 'sms' => 190],
                ['name' => 'Sun', 'sms' => 140],
            ],
            'success_rate' => [
                ['name' => 'Jan', 'rate' => 94],
                ['name' => 'Feb', 'rate' => 96],
                ['name' => 'Mar', 'rate' => 95],
                ['name' => 'Apr', 'rate' => 97],
                ['name' => 'May', 'rate' => 98],
                ['name' => 'Jun', 'rate' => 96],
            ]
        ]
    ]);
});

// Webhook Routes (for SMS/WhatsApp providers)
Route::post('webhooks/sms-delivery', function (Request $request) {
    // Handle SMS delivery status updates
    return response()->json(['success' => true]);
});

Route::post('webhooks/whatsapp-delivery', function (Request $request) {
    // Handle WhatsApp delivery status updates
    return response()->json(['success' => true]);
});
