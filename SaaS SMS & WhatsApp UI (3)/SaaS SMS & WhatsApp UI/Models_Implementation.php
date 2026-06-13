<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'email',
        'group',
        'platform',
        'notes'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function scheduledMessages(): HasMany
    {
        return $this->hasMany(ScheduledMessage::class);
    }

    // Scopes
    public function scopeByGroup($query, $group)
    {
        return $query->where('group', $group);
    }

    public function scopeByPlatform($query, $platform)
    {
        return $query->where('platform', $platform);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%$search%")
            ->orWhere('phone', 'like', "%$search%")
            ->orWhere('email', 'like', "%$search%");
    }
}

// Message Model
class Message extends Model
{
    protected $fillable = [
        'user_id',
        'contact_id',
        'message_type',
        'content',
        'status',
        'sent_at'
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(MessageLog::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('message_type', $type);
    }
}

// MessageTemplate Model
class MessageTemplate extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'content',
        'category'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scheduledMessages(): HasMany
    {
        return $this->hasMany(ScheduledMessage::class);
    }
}

// ScheduledMessage Model
class ScheduledMessage extends Model
{
    protected $fillable = [
        'user_id',
        'contact_id',
        'template_id',
        'message_type',
        'content',
        'scheduled_for',
        'status',
        'executed_at'
    ];

    protected $casts = [
        'scheduled_for' => 'datetime',
        'executed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(MessageTemplate::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeScheduledBefore($query, $date)
    {
        return $query->where('scheduled_for', '<', $date);
    }
}

// MessageLog Model
class MessageLog extends Model
{
    protected $fillable = [
        'message_id',
        'status',
        'provider_response'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}

// APIConfig Model
class APIConfig extends Model
{
    protected $fillable = [
        'user_id',
        'sms_provider',
        'sms_api_key',
        'sms_webhook',
        'whatsapp_provider',
        'whatsapp_api_key',
        'whatsapp_webhook'
    ];

    protected $hidden = ['sms_api_key', 'whatsapp_api_key'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

// SystemLog Model
class SystemLog extends Model
{
    protected $fillable = [
        'action',
        'user_id',
        'details',
        'ip_address'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}
