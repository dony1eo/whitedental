<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\DentalTooth;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = Patient::query()->withCount('appointments');

        if ($search = $request->query('search')) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('card_no', 'like', "%{$search}%");
            });
        }

        if ($doctorId = $request->query('doctorId')) {
            $query->whereHas('appointments', function($q) use ($doctorId) {
                $q->where('doctor_id', $doctorId);
            });
        }

        $limit = min((int)($request->query('limit', 20)), 200);
        $patients = $query->orderBy('created_at', 'desc')->paginate($limit);

        $items = collect($patients->items())->map(function($p) {
            return [
                'id' => $p->id,
                'cardNo' => $p->card_no,
                'firstName' => $p->first_name,
                'lastName' => $p->last_name,
                'middleName' => $p->middle_name,
                'name' => trim($p->first_name . ' ' . $p->last_name),
                'gender' => $p->gender,
                'dateOfBirth' => $p->date_of_birth,
                'phone' => $p->phone,
                'email' => $p->email,
                'source' => $p->source,
                'status' => $p->status,
                'notes' => $p->notes,
                'visitsCount' => $p->appointments_count,
                'createdAt' => $p->created_at,
            ];
        });

        return response()->json([
            'items' => $items,
            'total' => $patients->total(),
            'page' => $patients->currentPage(),
            'limit' => $limit,
        ]);
    }

    public function show($id)
    {
        $patient = Patient::with([
            'appointments' => function($q) {
                $q->with(['doctor:id,name,color', 'treatmentLines.service'])->orderBy('start_time', 'desc');
            },
            'dentalTeeth', 'treatmentPlans.items.service', 'payments', 'documents'
        ])->find($id);

        if (!$patient) return response()->json(['error' => 'Patient not found'], 404);

        return response()->json([
            'id' => $patient->id,
            'cardNo' => $patient->card_no,
            'firstName' => $patient->first_name,
            'lastName' => $patient->last_name,
            'middleName' => $patient->middle_name,
            'name' => trim($patient->first_name . ' ' . $patient->last_name),
            'gender' => $patient->gender,
            'dateOfBirth' => $patient->date_of_birth,
            'phone' => $patient->phone,
            'email' => $patient->email,
            'source' => $patient->source,
            'status' => $patient->status,
            'notes' => $patient->notes,
            'balance' => $patient->payments->sum('amount'),
            'visitsCount' => $patient->appointments->count(),
            'lastVisit' => $patient->appointments->first()?->start_time,
            'doctor' => $patient->appointments->first()?->doctor?->name,
            'appointments' => $patient->appointments->map(fn($a) => [
                'id' => $a->id,
                'date' => $a->start_time,
                'startTime' => $a->start_time,
                'endTime' => $a->end_time,
                'status' => $a->status,
                'visitType' => $a->visit_type,
                'chair' => $a->chair,
                'doctor' => $a->doctor?->name,
                'service' => $a->treatmentLines->first()?->service?->name,
                'amount' => $a->treatmentLines->sum('price'),
            ]),
            'dentalChart' => $patient->dentalTeeth,
            'treatmentPlans' => $patient->treatmentPlans,
            'payments' => $patient->payments,
            'documents' => $patient->documents,
            'createdAt' => $patient->created_at,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
        ]);

        $allNos = Patient::pluck('card_no')->toArray();
        $nums = array_filter(array_map('intval', $allNos), fn($n) => $n >= 2000);
        $cardNo = (string)(count($nums) > 0 ? max($nums) + 1 : 2230);

        $patient = Patient::create([
            'card_no' => $cardNo,
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'middle_name' => $request->middleName ?? null,
            'gender' => $request->gender ?? 'female',
            'date_of_birth' => $request->dateOfBirth ?: null,
            'phone' => $request->phone ?? null,
            'email' => $request->email ?? null,
            'source' => $request->source ?? null,
            'status' => $request->status ?? 'active',
            'notes' => $request->notes ?? null,
        ]);

        return response()->json([
            'id' => $patient->id,
            'cardNo' => $patient->card_no,
            'firstName' => $patient->first_name,
            'lastName' => $patient->last_name,
            'middleName' => $patient->middle_name,
            'name' => trim($patient->first_name . ' ' . $patient->last_name),
            'gender' => $patient->gender,
            'dateOfBirth' => $patient->date_of_birth,
            'phone' => $patient->phone,
            'email' => $patient->email,
            'source' => $patient->source,
            'status' => $patient->status,
            'notes' => $patient->notes,
            'createdAt' => $patient->created_at,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $patient = Patient::findOrFail($id);
        $data = [];
        if ($request->has('firstName')) $data['first_name'] = $request->firstName;
        if ($request->has('lastName')) $data['last_name'] = $request->lastName;
        if ($request->has('middleName')) $data['middle_name'] = $request->middleName;
        if ($request->has('gender')) $data['gender'] = $request->gender;
        if ($request->has('dateOfBirth')) $data['date_of_birth'] = $request->dateOfBirth;
        if ($request->has('phone')) $data['phone'] = $request->phone;
        if ($request->has('email')) $data['email'] = $request->email;
        if ($request->has('source')) $data['source'] = $request->source;
        if ($request->has('status')) $data['status'] = $request->status;
        if ($request->has('notes')) $data['notes'] = $request->notes;
        $patient->update($data);
        return response()->json(['id' => $patient->id, 'cardNo' => $patient->card_no, 'firstName' => $patient->first_name, 'lastName' => $patient->last_name]);
    }

    public function updateDentalChart(Request $request, $id)
    {
        $request->validate(['tooth_no' => 'required|integer', 'status' => 'required|string']);
        $tooth = DentalTooth::updateOrCreate(
            ['patient_id' => (int)$id, 'tooth_no' => $request->tooth_no],
            ['status' => $request->status, 'notes' => $request->notes]
        );
        return response()->json($tooth);
    }
}
