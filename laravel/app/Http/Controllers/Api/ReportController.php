<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\TreatmentLine;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function byDoctor(Request $request)
    {
        $month = (int)($request->query('month', now()->month));
        $year = (int)($request->query('year', now()->year));
        $rows = TreatmentLine::whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->select('doctor_id', DB::raw('SUM(price) as revenue'), DB::raw('COUNT(*) as visits_count'))
            ->groupBy('doctor_id')
            ->orderByDesc('revenue')
            ->get()
            ->map(function($r) {
                $doc = User::find($r->doctor_id);
                return [
                    'id' => $doc?->id,
                    'doctorName' => $doc?->name,
                    'name' => $doc?->name,
                    'color' => $doc?->color,
                    'revenue' => (float)$r->revenue,
                    'visitsCount' => $r->visits_count,
                ];
            });
        return response()->json($rows);
    }

    public function byService()
    {
        $rows = TreatmentLine::select('service_id', DB::raw('SUM(price) as revenue'))
            ->groupBy('service_id')->orderByDesc('revenue')->limit(10)
            ->get()->map(function($r) {
                $svc = \App\Models\Service::find($r->service_id);
                return [
                    'id' => $svc?->id,
                    'name' => $svc?->name,
                    'category' => $svc?->category,
                    'revenue' => (float)$r->revenue,
                ];
            });
        return response()->json($rows);
    }

    public function patientsReport(Request $request)
    {
        $month = (int)($request->query('month', now()->month));
        $year = (int)($request->query('year', now()->year));
        $newPatients = Patient::whereMonth('created_at', $month)->whereYear('created_at', $year)->count();
        $returning = Patient::whereMonth('created_at', $month)->whereYear('created_at', $year)
            ->whereHas('appointments', function($q) use ($month, $year) {
                $q->whereMonth('start_time', $month)->whereYear('start_time', $year);
            }, '>', 1)->count();
        return response()->json(['newPatients' => $newPatients, 'returning' => $returning]);
    }
}
