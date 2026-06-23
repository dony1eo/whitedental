<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Supplier;
use App\Models\WarehouseDoc;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function materials(Request $request)
    {
        $query = Material::with('supplier:id,name');
        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }
        $items = $query->orderBy('name')->get();
        return response()->json([
            'items' => $items,
            'stats' => [
                'total' => $items->count(),
                'lowItems' => $items->filter(fn($m) => $m->stock < $m->min_stock)->count(),
                'totalValue' => $items->sum(fn($m) => $m->stock * $m->price),
            ]
        ]);
    }

    public function storeMaterial(Request $request)
    {
        $request->validate(['name' => 'required']);
        $mat = Material::create([
            'name' => $request->name,
            'category' => $request->category ?: 'Прочее',
            'stock' => (float)($request->stock ?? 0),
            'min_stock' => (float)($request->min_stock ?? 0),
            'unit' => $request->unit ?: 'шт',
            'price' => (float)($request->price ?? 0),
            'supplier_id' => $request->supplierId ? (int)$request->supplierId : null,
        ]);
        return response()->json($mat, 201);
    }

    public function updateMaterial(Request $request, $id)
    {
        $mat = Material::findOrFail($id);
        $mat->update($request->all());
        return response()->json($mat);
    }

    public function suppliers()
    {
        return response()->json(
            Supplier::withCount('warehouseDocs')->orderBy('name')->get()
        );
    }

    public function documents()
    {
        return response()->json(
            WarehouseDoc::with(['supplier:id,name', 'lines.material:id,name'])
                ->orderBy('created_at', 'desc')->get()
        );
    }

    public function storeDocument(Request $request)
    {
        $request->validate(['type' => 'required', 'lines' => 'required|array']);
        $lastDoc = WarehouseDoc::latest('id')->first();
        $docNo = 'ПР-' . (($lastDoc?->id ?? 1000) + 1);
        $totalSum = collect($request->lines)->sum(fn($l) => $l['qty'] * $l['price']);

        $doc = WarehouseDoc::create([
            'doc_no' => $docNo,
            'type' => $request->type,
            'supplier_id' => $request->supplierId ? (int)$request->supplierId : null,
            'party' => $request->party,
            'status' => 'posted',
            'total_sum' => $totalSum,
        ]);

        foreach ($request->lines as $line) {
            $doc->lines()->create([
                'material_id' => (int)$line['materialId'],
                'qty' => (float)$line['qty'],
                'price' => (float)$line['price'],
            ]);
        }

        if (in_array($request->type, ['receipt', 'dIncome'])) {
            foreach ($request->lines as $line) {
                Material::where('id', (int)$line['materialId'])
                    ->increment('stock', (float)$line['qty']);
            }
        }

        return response()->json($doc->load('lines'), 201);
    }
}
