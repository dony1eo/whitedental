<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        $user->update(['last_login' => now()]);
        $secret = config('jwt.secret', 'white-dental-jwt-secret-2026');
        $header = rtrim(strtr(base64_encode(json_encode(['alg'=>'HS256','typ'=>'JWT'])), '+/', '-_'), '=');
        $payload = rtrim(strtr(base64_encode(json_encode([
            'iss' => 'white-dental',
            'iat' => time(),
            'exp' => time() + (int)config('jwt.ttl', 10080) * 60,
            'sub' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'name' => $user->name,
        ])), '+/', '-_'), '=');
        $signature = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true)), '+/', '-_'), '=');
        $token = "$header.$payload.$signature";
        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'role' => $user->role,
                'color' => $user->color,
            ]
        ]);
    }

    public function me(Request $request)
    {
        $userData = $request->attributes->get('auth_user');
        if (!$userData) {
            return response()->json(['error' => 'No token'], 401);
        }
        $user = User::find($userData['sub']);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }
        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role,
            'specialty' => $user->specialty,
            'phone' => $user->phone,
            'color' => $user->color,
        ]);
    }
}
