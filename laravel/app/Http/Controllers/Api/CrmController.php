<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Waitlist;
use App\Models\Task;
use Illuminate\Http\Request;

class CrmController extends Controller
{
    public function leads()
    {
        return response()->json(
            Lead::with('curator:id,name,color')->orderBy('created_at', 'desc')->get()
        );
    }

    public function storeLead(Request $request)
    {
        $request->validate(['name' => 'required']);
        $lead = Lead::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'source' => $request->source ?: 'online',
            'stage' => (int)($request->stage ?? 0),
            'potential' => (float)($request->potential ?? 0),
            'curator_id' => $request->curatorId ? (int)$request->curatorId : null,
            'patient_id' => $request->patientId ? (int)$request->patientId : null,
            'notes' => $request->notes,
        ]);
        return response()->json($lead, 201);
    }

    public function updateLeadStage(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);
        $lead->update(['stage' => (int)$request->stage]);
        return response()->json($lead);
    }

    public function waitlist()
    {
        return response()->json(
            Waitlist::orderBy('priority', 'desc')->orderBy('created_at')->get()->map(fn($w) => [
                'id'            => $w->id,
                'patientName'   => $w->patient_name,
                'phone'         => $w->phone,
                'desiredDoctor' => $w->desired_doctor,
                'dateWindow'    => $w->date_window,
                'priority'      => $w->priority,
                'createdAt'     => $w->created_at,
            ])
        );
    }

    public function storeWaitlist(Request $request)
    {
        $request->validate(['patientName' => 'required']);
        $entry = Waitlist::create([
            'patient_name' => $request->patientName,
            'phone' => $request->phone,
            'desired_doctor' => $request->desiredDoctor,
            'date_window' => $request->dateWindow,
            'priority' => $request->priority ?: 'normal',
        ]);
        return response()->json([
            'id'            => $entry->id,
            'patientName'   => $entry->patient_name,
            'phone'         => $entry->phone,
            'desiredDoctor' => $entry->desired_doctor,
            'dateWindow'    => $entry->date_window,
            'priority'      => $entry->priority,
            'createdAt'     => $entry->created_at,
        ], 201);
    }

    public function tasks()
    {
        return response()->json(
            Task::with('assignee:id,name,color')
                ->orderBy('done')->orderBy('created_at')->get()
        );
    }

    public function toggleTask(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update(['done' => !$task->done]);
        return response()->json($task);
    }
}
