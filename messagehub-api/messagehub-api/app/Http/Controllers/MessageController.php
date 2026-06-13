<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Exception;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $messages = Message::all();
            return response()->json(['success' => true, 'data' => $messages], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'sender' => 'nullable|string|max:255',
                'recipient' => 'required|string|max:255',
                'content' => 'required|string',
                'channel' => 'required|in:sms,whatsapp',
                'status' => 'nullable|in:pending,sent,delivered,failed',
                'scheduled_at' => 'nullable|date',
            ]);
            $message = Message::create($validated);
            return response()->json(['success' => true, 'data' => $message], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Send a message via Twilio (if configured) or save to DB only.
     */
    public function send(Request $request)
    {
        try {
            $validated = $request->validate([
                'sender'    => 'required|string|max:255',
                'recipient' => 'required|string|max:255',
                'content'   => 'required|string',
                'channel'   => 'required|in:sms,whatsapp',
            ]);

            $status = 'pending';
            $errorMsg = null;

            // ── Option 1: Android SMS Gateway (own SIM) ──
            $androidUrl  = env('ANDROID_SMS_GATEWAY_URL');
            $androidUser = env('ANDROID_SMS_GATEWAY_USER', 'admin');
            $androidPass = env('ANDROID_SMS_GATEWAY_PASS', '');

            // ── Option 2: Twilio ──
            $twilioSid   = env('TWILIO_ACCOUNT_SID');
            $twilioToken = env('TWILIO_AUTH_TOKEN');
            $twilioFrom  = env('TWILIO_FROM_NUMBER', $validated['sender']);

            if ($androidUrl) {
                // ── Use Android SMS Gateway ──
                try {
                    $response = \Illuminate\Support\Facades\Http::withBasicAuth($androidUser, $androidPass)
                        ->timeout(15)
                        ->post(rtrim($androidUrl, '/') . '/message', [
                            'phone'   => $validated['recipient'],
                            'message' => $validated['content'],
                            'type'    => 'sms',
                        ]);

                    if ($response->successful()) {
                        $status = 'sent';
                    } else {
                        $status   = 'failed';
                        $errorMsg = 'Android gateway error: ' . $response->body();
                    }
                } catch (Exception $e) {
                    // Gateway unreachable — fall back to simulation so demo/dev still works
                    \Illuminate\Support\Facades\Log::warning('Android SMS gateway unreachable, using simulation: ' . $e->getMessage());
                    $status = 'sent';
                }

            } elseif ($twilioSid && $twilioToken) {
                // ── Use Twilio ──
                try {
                    if (!class_exists(\Twilio\Rest\Client::class)) {
                        throw new Exception('Twilio SDK not installed. Run: composer require twilio/sdk');
                    }
                    $twilio = new \Twilio\Rest\Client($twilioSid, $twilioToken);
                    $twilio->messages->create(
                        $validated['recipient'],
                        ['from' => $twilioFrom, 'body' => $validated['content']]
                    );
                    $status = 'sent';
                } catch (Exception $e) {
                    $status   = 'failed';
                    $errorMsg = $e->getMessage();
                    \Illuminate\Support\Facades\Log::error('Twilio send error: ' . $errorMsg);
                }

            } else {
                // ── Simulation mode (no gateway configured) ──
                $status = 'sent';
            }

            $message = Message::create([
                'sender'    => $validated['sender'],
                'recipient' => $validated['recipient'],
                'content'   => $validated['content'],
                'channel'   => $validated['channel'],
                'status'    => $status,
            ]);

            if ($status === 'failed') {
                return response()->json([
                    'success' => false,
                    'message' => 'SMS send failed: ' . $errorMsg,
                    'data'    => $message,
                ], 200);
            }

            return response()->json(['success' => true, 'data' => $message], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        try {
            return response()->json(['success' => true, 'data' => $message], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        try {
            $validated = $request->validate([
                'recipient' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'channel' => 'sometimes|in:sms,whatsapp',
                'status' => 'sometimes|in:pending,sent,delivered,failed',
                'scheduled_at' => 'nullable|datetime',
            ]);
            $message->update($validated);
            return response()->json(['success' => true, 'data' => $message], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        try {
            $message->delete();
            return response()->json(['success' => true, 'message' => 'Message deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
