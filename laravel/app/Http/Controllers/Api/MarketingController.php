<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\PatientGroup;
use Illuminate\Http\Request;

class MarketingController extends Controller
{
    public function campaigns()
    {
        return response()->json(Campaign::orderBy('created_at', 'desc')->get());
    }

    public function storeCampaign(Request $request)
    {
        $request->validate(['name' => 'required', 'channel' => 'required']);
        $c = Campaign::create([
            'name' => $request->name,
            'channel' => $request->channel,
            'group_name' => $request->groupName,
            'reach' => (int)($request->reach ?? 0),
            'status' => $request->status ?: 'draft',
        ]);
        return response()->json($c, 201);
    }

    public function groups()
    {
        return response()->json(PatientGroup::orderBy('name')->get());
    }

    public function storeGroup(Request $request)
    {
        $request->validate(['name' => 'required', 'condition' => 'required']);
        $g = PatientGroup::create([
            'name' => $request->name,
            'condition' => $request->condition,
            'color' => $request->color ?: '#0787c9',
            'count' => (int)($request->count ?? 0),
        ]);
        return response()->json($g, 201);
    }

    public function stats()
    {
        $sent = Campaign::where('status', 'sent')
            ->where('created_at', '>=', now()->subDays(30))->sum('reach');
        return response()->json([
            'sent' => $sent,
            'groups' => PatientGroup::count(),
            'channels' => 3,
            'deliveredRate' => 97.4,
        ]);
    }
}
