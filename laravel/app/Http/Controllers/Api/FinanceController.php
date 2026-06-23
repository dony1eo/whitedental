<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\CashboxEntry;
use App\Models\Payment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinanceController extends Controller
{
    public function cashbox(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        $entries = CashboxEntry::whereDate('created_at', $date)->orderBy('created_at')->get();
        $income = $entries->where('is_income', true)->sum('amount');
        $expense = $entries->where('is_income', false)->sum('amount');
        return response()->json([
            'entries' => $entries,
            'income' => (float)$income,
            'expense' => (float)$expense,
            'balance' => (float)($income - $expense),
        ]);
    }

    public function storeCashboxEntry(Request $request)
    {
        $request->validate([
            'operation' => 'required',
            'method' => 'required',
            'amount' => 'required|numeric',
            'isIncome' => 'required|boolean',
        ]);
        $entry = CashboxEntry::create([
            'operation' => $request->operation,
            'method' => $request->method,
            'amount' => abs((float)$request->amount),
            'is_income' => (bool)$request->isIncome,
            'patient_id' => $request->patientId ? (int)$request->patientId : null,
        ]);
        return response()->json($entry, 201);
    }

    public function debtors()
    {
        $debtorIds = Payment::select('patient_id', DB::raw('SUM(amount) as total'))
            ->groupBy('patient_id')
            ->havingRaw('SUM(amount) < 0')
            ->pluck('patient_id');
        $patients = Patient::whereIn('id', $debtorIds)
            ->select('id','first_name','last_name','phone')->get();
        $result = $patients->map(function($p) {
            $debt = Payment::where('patient_id', $p->id)->sum('amount');
            return [
                'id' => $p->id,
                'patientName' => $p->first_name . ' ' . $p->last_name,
                'phone' => $p->phone,
                'debt' => abs((float)$debt),
            ];
        });
        return response()->json($result);
    }

    public function pnl(Request $request)
    {
        $month = (int)($request->query('month', now()->month));
        $year = (int)($request->query('year', now()->year));
        $revenue = CashboxEntry::where('is_income', true)
            ->whereMonth('created_at', $month)->whereYear('created_at', $year)->sum('amount');
        $expenses = CashboxEntry::where('is_income', false)
            ->whereMonth('created_at', $month)->whereYear('created_at', $year)->sum('amount');
        $net = $revenue - $expenses;
        $margin = $revenue > 0 ? round(($net / $revenue) * 100) : 0;
        return response()->json([
            'revenue' => (float)$revenue,
            'expenses' => (float)$expenses,
            'netProfit' => (float)$net,
            'margin' => $margin,
        ]);
    }
}
