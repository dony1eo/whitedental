<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function branches()
    {
        return response()->json(
            Branch::orderBy('is_main', 'desc')->orderBy('name')->get()
        );
    }

    public function storeBranch(Request $request)
    {
        $request->validate(['name' => 'required']);
        $b = Branch::create([
            'name' => $request->name,
            'address' => $request->address,
            'is_main' => (bool)($request->isMain ?? false),
        ]);
        return response()->json($b, 201);
    }

    public function rbac()
    {
        $path = storage_path('app/rbac.json');
        if (!file_exists($path)) {
            return response()->make('null', 200, ['Content-Type' => 'application/json']);
        }
        return response()->json(json_decode(file_get_contents($path), true));
    }

    public function saveRbac(Request $request)
    {
        $dir = storage_path('app');
        if (!is_dir($dir)) mkdir($dir, 0775, true);
        file_put_contents($dir . '/rbac.json', json_encode($request->all()));
        return response()->json(['ok' => true]);
    }

    public function integrations()
    {
        return response()->json([
            ['name' => 'Telegram Bot API',          'icon' => 'send',           'connected' => true],
            ['name' => 'WhatsApp Business API',     'icon' => 'message-circle', 'connected' => true],
            ['name' => 'Eskiz / PlayMobile (SMS)',  'icon' => 'message-square', 'connected' => true],
            ['name' => 'Payme',                     'icon' => 'credit-card',    'connected' => true],
            ['name' => 'Click',                     'icon' => 'credit-card',    'connected' => false],
            ['name' => 'Uzcard',                    'icon' => 'credit-card',    'connected' => false],
            ['name' => 'Фискальная касса (ОФД.uz)','icon' => 'receipt',         'connected' => true],
            ['name' => 'Zadarma (IP-телефония)',    'icon' => 'phone',          'connected' => false],
        ]);
    }
}
