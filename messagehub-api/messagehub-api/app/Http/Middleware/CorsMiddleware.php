<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8080',
        ];

        $origin = $request->header('Origin');

        // Allow any origin in local development
        if (app()->environment('local')) {
            $allowedOrigins = [$origin ?? '*'];
        }

        // Check if origin is allowed
        $isAllowed = in_array($origin, $allowedOrigins);

        // If not in local and origin not allowed, don't add headers
        if (!app()->environment('local') && !$isAllowed && $origin) {
            return $next($request);
        }

        $headers = [
            'Access-Control-Allow-Origin' => $origin ?? '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Max-Age' => '86400',
            'Access-Control-Allow-Credentials' => 'true',
        ];

        // Handle preflight requests
        if ($request->isMethod('OPTIONS')) {
            return response('', 200, $headers);
        }

        $response = $next($request);

        // Add CORS headers to response
        foreach ($headers as $key => $value) {
            $response->header($key, $value);
        }

        return $response;
    }
}
