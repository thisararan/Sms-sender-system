<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $contacts = Contact::all();
            return response()->json(['success' => true, 'data' => $contacts], 200);
        } catch (Exception $e) {
            Log::error('ContactController@index: ' . $e->getMessage());
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
                'phone' => 'required|string|max:20',
                'email' => 'nullable|email|max:255',
                'group' => 'nullable|string|max:100',
            ]);

            // Set default group if not provided
            if (empty($validated['group'])) {
                $validated['group'] = 'General';
            }

            $contact = Contact::create($validated);
            
            return response()->json([
                'success' => true,
                'data' => $contact,
                'message' => 'Contact created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ContactController@store validation: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return response()->json([
                    'success' => false,
                    'message' => 'This phone number already exists in your contacts.'
                ], 422);
            }
            Log::error('ContactController@store DB: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        } catch (Exception $e) {
            Log::error('ContactController@store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        try {
            return response()->json(['success' => true, 'data' => $contact], 200);
        } catch (Exception $e) {
            Log::error('ContactController@show: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'email' => 'nullable|email|max:255',
                'group' => 'nullable|string|max:100',
            ]);

            $contact->update($validated);
            
            return response()->json([
                'success' => true,
                'data' => $contact
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ContactController@update validation: ' . json_encode($e->errors()));
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error('ContactController@update: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        try {
            $contact->delete();
            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ], 200);
        } catch (Exception $e) {
            Log::error('ContactController@destroy: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
