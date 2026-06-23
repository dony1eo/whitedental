<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\TreatmentLine;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with([
            'patient:id,first_name,last_name,phone,card_no',
            'doctor:id,name,color,specialty',
            'treatmentLines.service:id,name,price'
        ]);

        if ($date = $request->query('date')) {
            $query->whereDate('start_time', $date);
        }
        if ($from = $request->query('from')) {
            $query->whereDate('start_time', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->whereDate('start_time', '<=', $to);
        }
        if ($doctorId = $request->query('doctorId')) {
            $query->where('doctor_id', $doctorId);
        }
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->orderBy('start_time')->get()->map(function($a) {
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
                'direction' => $a->direction,
                'source' => $a->source,
                'comment' => $a->comment,
                'patient' => $a->patient ? [
                    'id' => $a->patient->id,
                    'firstName' => $a->patient->first_name,
                    'lastName' => $a->patient->last_name,
                    'phone' => $a->patient->phone,
                    'cardNo' => $a->patient->card_no,
                ] : null,
                'doctor' => $a->doctor ? [
                    'id' => $a->doctor->id,
                    'name' => $a->doctor->name,
                    'color' => $a->doctor->color,
                    'specialty' => $a->doctor->specialty,
                ] : null,
                'treatmentLines' => $a->treatmentLines->map(fn($l) => [
                    'id' => $l->id,
                    'serviceId' => $l->service_id,
                    'toothNo' => $l->tooth_no,
                    'qty' => $l->qty,
                    'price' => $l->price,
                    'doctorPct' => $l->doctor_pct,
                    'service' => $l->service ? ['name' => $l->service->name, 'price' => $l->service->price] : null,
                ]),
            ];
        }));
    }

    public function store(Request $request)
    {
        if ($request->startTime) {
            $start = new \DateTime($request->startTime);
            $end = $request->endTime ? new \DateTime($request->endTime) : (clone $start)->modify('+30 minutes');
        } elseif ($request->date && $request->time) {
            $start = new \DateTime($request->date . 'T' . $request->time . ':00');
            $mins = (int)($request->duration ?? 30);
            $end = (clone $start)->modify("+{$mins} minutes");
        } else {
            return response()->json(['error' => 'startTime or date+time required'], 400);
        }

        $appt = Appointment::create([
            'patient_id' => (int)$request->patientId,
            'doctor_id' => (int)$request->doctorId,
            'chair' => $request->chair ?: '1',
            'visit_type' => $request->visitType ?: 'treatment',
            'visit_kind' => $request->visitKind ?: 'regular',
            'start_time' => $start,
            'end_time' => $end,
            'status' => $request->status ?: 'not_confirmed',
            'direction' => $request->direction,
            'source' => $request->source,
            'comment' => $request->comment,
        ]);
        $appt->load(['patient', 'doctor']);
        return response()->json([
            'id' => $appt->id,
            'patientId' => $appt->patient_id,
            'doctorId' => $appt->doctor_id,
            'chair' => $appt->chair,
            'visitType' => $appt->visit_type,
            'visitKind' => $appt->visit_kind,
            'startTime' => $appt->start_time,
            'endTime' => $appt->end_time,
            'status' => $appt->status,
            'direction' => $appt->direction,
            'source' => $appt->source,
            'comment' => $appt->comment,
            'patient' => $appt->patient ? [
                'id' => $appt->patient->id,
                'firstName' => $appt->patient->first_name,
                'lastName' => $appt->patient->last_name,
            ] : null,
            'doctor' => $appt->doctor ? [
                'id' => $appt->doctor->id,
                'name' => $appt->doctor->name,
                'color' => $appt->doctor->color,
            ] : null,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $appt = Appointment::findOrFail($id);
        $data = [];
        if ($request->has('patientId')) $data['patient_id'] = (int)$request->patientId;
        if ($request->has('doctorId')) $data['doctor_id'] = (int)$request->doctorId;
        if ($request->has('chair')) $data['chair'] = $request->chair;
        if ($request->has('visitType')) $data['visit_type'] = $request->visitType;
        if ($request->has('visitKind')) $data['visit_kind'] = $request->visitKind;
        if ($request->has('status')) $data['status'] = $request->status;
        if ($request->has('comment')) $data['comment'] = $request->comment;
        if ($request->has('source')) $data['source'] = $request->source;
        if ($request->startTime) $data['start_time'] = new \DateTime($request->startTime);
        if ($request->endTime) $data['end_time'] = new \DateTime($request->endTime);
        if ($request->date && $request->time) {
            $data['start_time'] = new \DateTime($request->date . 'T' . $request->time . ':00');
            $data['end_time'] = (clone $data['start_time'])->modify('+30 minutes');
        }
        $appt->update($data);
        return response()->json([
            'id' => $appt->id,
            'patientId' => $appt->patient_id,
            'doctorId' => $appt->doctor_id,
            'chair' => $appt->chair,
            'visitType' => $appt->visit_type,
            'visitKind' => $appt->visit_kind,
            'startTime' => $appt->start_time,
            'endTime' => $appt->end_time,
            'status' => $appt->status,
            'comment' => $appt->comment,
        ]);
    }

    public function destroy($id)
    {
        Appointment::destroy($id);
        return response()->json(['success' => true]);
    }

    public function addTreatmentLine(Request $request, $id)
    {
        $line = TreatmentLine::create([
            'appointment_id' => (int)$id,
            'service_id' => (int)$request->serviceId,
            'doctor_id' => (int)$request->doctorId,
            'tooth_no' => $request->toothNo ? (int)$request->toothNo : null,
            'qty' => (int)($request->qty ?? 1),
            'price' => (float)$request->price,
            'doctor_pct' => (int)($request->doctorPct ?? 30),
        ]);
        return response()->json([
            'id' => $line->id,
            'appointmentId' => $line->appointment_id,
            'serviceId' => $line->service_id,
            'toothNo' => $line->tooth_no,
            'qty' => $line->qty,
            'price' => $line->price,
            'doctorPct' => $line->doctor_pct,
            'service' => $line->service ? ['name' => $line->service->name, 'price' => $line->service->price] : null,
        ], 201);
    }
}
