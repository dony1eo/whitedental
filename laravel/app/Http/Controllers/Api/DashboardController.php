<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\CashboxEntry;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Material;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function overview(Request $request)
    {
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();

        // KPIs
        $revenueToday = CashboxEntry::where('is_income', true)
            ->whereDate('created_at', $today)->sum('amount');
        $expenseToday = CashboxEntry::where('is_income', false)
            ->whereDate('created_at', $today)->sum('amount');
        $cashbox = $revenueToday - $expenseToday;
        $newPatients = Patient::whereDate('created_at', $today)->count();
        $newPatientsYesterday = Patient::whereDate('created_at', $yesterday)->count();
        
        $debtorIds = Payment::select('patient_id')
            ->groupBy('patient_id')
            ->havingRaw('SUM(amount) < 0')
            ->pluck('patient_id');
        $debtors = $debtorIds->count();

        // Today's appointments
        $appointments = Appointment::with([
            'patient:id,first_name,last_name',
            'doctor:id,name,color'
        ])->whereDate('start_time', $today)
          ->orderBy('start_time')
          ->limit(10)
          ->get()
          ->map(function($a) {
              return [
                  'id' => $a->id,
                  'patientId' => $a->patient_id,
                  'doctorId' => $a->doctor_id,
                  'chair' => $a->chair,
                  'visitType' => $a->visit_type,
                  'visitKind' => $a->visit_kind,
                  'startTime' => $a->start_time,
                  'endTime' => $a->end_time,
                  'status' => $a->status,
                  'patient' => $a->patient ? ['firstName' => $a->patient->first_name, 'lastName' => $a->patient->last_name] : null,
                  'doctor' => $a->doctor ? ['name' => $a->doctor->name, 'color' => $a->doctor->color] : null,
              ];
          });

        // Low stock
        $lowStock = Material::whereRaw('stock < min_stock')->limit(5)->get();

        // Leads by stage
        $leads = Lead::select('stage', DB::raw('count(*) as _count'))
            ->groupBy('stage')->get();

        // Doctor load — optimized: single query for all doctors
        $apptsByDoctor = Appointment::whereDate('start_time', $today)
            ->select('doctor_id', DB::raw('count(*) as appts'))
            ->groupBy('doctor_id')->get();
        $doctorIds = $apptsByDoctor->pluck('doctor_id');
        $doctors = User::whereIn('id', $doctorIds)->select('id','name','color')->get()->keyBy('id');
        $docLoad = $apptsByDoctor->map(function($a) use ($doctors) {
            $doc = $doctors->get($a->doctor_id);
            $load = min(100, round(($a->appts / 10) * 100));
            return [
                'id' => $doc?->id,
                'name' => $doc?->name,
                'color' => $doc?->color ?? '#0787c9',
                'appts' => $a->appts,
                'load' => $load,
            ];
        });

        return response()->json([
            'kpis' => [
                'revenueToday' => (float)$revenueToday,
                'cashbox' => (float)$cashbox,
                'newPatients' => $newPatients,
                'newPatientsVsYesterday' => $newPatients - $newPatientsYesterday,
                'debtors' => $debtors,
            ],
            'appointments' => $appointments,
            'lowStock' => $lowStock,
            'leads' => $leads,
            'docLoad' => $docLoad,
        ]);
    }
}
