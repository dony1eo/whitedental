<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['error' => 'No token provided'], 401);
        }

        $token = substr($authHeader, 7);
        $secret = config('jwt.secret', 'white-dental-jwt-secret-2026');
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        [$header, $payload, $signature] = $parts;

        $validSig = rtrim(strtr(base64_encode(
            hash_hmac('sha256', "$header.$payload", $secret, true)
        ), '+/', '-_'), '=');

        if (!hash_equals($validSig, $signature)) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $decoded = json_decode(
            base64_decode(strtr($payload, '-_', '+/')),
            true
        );

        if (!$decoded || !isset($decoded['exp']) || $decoded['exp'] < time()) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $request->attributes->set('auth_user', $decoded);

        return $next($request);
    }
}
