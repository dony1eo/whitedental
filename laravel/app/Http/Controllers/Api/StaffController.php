<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StaffController extends Controller
{
    public function index(Request $request)
    {
        $query = User::select('id','name','email','phone','role','specialty','last_login','color');
        if ($role = $request->query('role')) {
            $query->where('role', $role);
        }
        return response()->json($query->orderBy('name')->get()->map(function($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role,
                'specialty' => $u->specialty,
                'lastLogin' => $u->last_login,
                'color' => $u->color,
            ];
        }));
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required', 'email' => 'required|email|unique:users']);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password ?: 'changeme123'),
            'role' => $request->role ?: 'doctor',
            'specialty' => $request->specialty,
            'phone' => $request->phone,
            'color' => $request->color ?: '#0787c9',
        ]);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'specialty' => $user->specialty,
            'lastLogin' => $user->last_login,
            'color' => $user->color,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $data = [];
        if ($request->has('name')) $data['name'] = $request->name;
        if ($request->has('email')) $data['email'] = $request->email;
        if ($request->has('role')) $data['role'] = $request->role;
        if ($request->has('specialty')) $data['specialty'] = $request->specialty;
        if ($request->has('phone')) $data['phone'] = $request->phone;
        if ($request->has('color')) $data['color'] = $request->color;
        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }
        $user->update($data);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'specialty' => $user->specialty,
            'lastLogin' => $user->last_login,
            'color' => $user->color,
        ]);
    }
}
