<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::where('is_active', true);
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        if ($search = $request->query('search')) {
            $query->where('name', 'like', "%{$search}%");
        }
        return response()->json($query->orderBy('category')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'category' => 'required',
            'price' => 'required|numeric',
        ]);
        $svc = Service::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => (float)$request->price,
            'doctor_pct' => (int)($request->doctorPct ?? 30),
            'duration' => (int)($request->duration ?? 45),
            'is_active' => true,
        ]);
        return response()->json($svc, 201);
    }

    public function update(Request $request, $id)
    {
        $svc = Service::findOrFail($id);
        $svc->update($request->all());
        return response()->json($svc);
    }

    public function destroy($id)
    {
        Service::where('id', $id)->update(['is_active' => false]);
        return response()->json(['success' => true]);
    }
}
