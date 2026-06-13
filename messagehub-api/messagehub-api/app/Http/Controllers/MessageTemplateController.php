<?php

namespace App\Http\Controllers;

use App\Models\MessageTemplate;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class MessageTemplateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $templates = MessageTemplate::all();
            return response()->json(['success' => true, 'data' => $templates], 200);
        } catch (Exception $e) {
            Log::error('MessageTemplateController@index: ' . $e->getMessage());
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
                'name' => 'required|string|max:255',
                'content' => 'required|string',
                'category' => 'nullable|string|max:100',
                'variables' => 'nullable|array',
            ]);

            // Set default category if not provided
            if (empty($validated['category'])) {
                $validated['category'] = 'General';
            }

            $template = MessageTemplate::create($validated);

            return response()->json([
                'success' => true,
                'data' => $template,
                'message' => 'Template created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('MessageTemplateController@store validation: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('MessageTemplateController@store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MessageTemplate $messageTemplate)
    {
        try {
            return response()->json(['success' => true, 'data' => $messageTemplate], 200);
        } catch (Exception $e) {
            Log::error('MessageTemplateController@show: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MessageTemplate $messageTemplate)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'category' => 'nullable|string|max:100',
                'variables' => 'nullable|array',
            ]);

            $messageTemplate->update($validated);

            return response()->json([
                'success' => true,
                'data' => $messageTemplate
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('MessageTemplateController@update validation: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('MessageTemplateController@update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MessageTemplate $messageTemplate)
    {
        try {
            $messageTemplate->delete();
            return response()->json([
                'success' => true,
                'message' => 'Template deleted successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('MessageTemplateController@destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
