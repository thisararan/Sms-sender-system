<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            if (!Schema::hasColumn('messages', 'recipient')) {
                $table->string('recipient')->after('sender');
            }
            if (!Schema::hasColumn('messages', 'content')) {
                $table->text('content')->after('recipient');
            }
            if (!Schema::hasColumn('messages', 'channel')) {
                $table->enum('channel', ['sms', 'whatsapp'])->default('sms')->after('content');
            }
            if (!Schema::hasColumn('messages', 'status')) {
                $table->enum('status', ['pending', 'sent', 'delivered', 'failed'])->default('pending')->after('channel');
            }
            if (!Schema::hasColumn('messages', 'scheduled_at')) {
                $table->timestamp('scheduled_at')->nullable()->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['recipient', 'content', 'channel', 'status', 'scheduled_at']);
        });
    }
};
