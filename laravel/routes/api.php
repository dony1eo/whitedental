<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\CrmController;
use App\Http\Controllers\Api\MarketingController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingsController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/auth/me', [AuthController::class, 'me']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/dashboard/overview', [DashboardController::class, 'overview']);

    Route::get('/patients', [PatientController::class, 'index']);
    Route::get('/patients/{id}', [PatientController::class, 'show']);
    Route::post('/patients', [PatientController::class, 'store']);
    Route::put('/patients/{id}', [PatientController::class, 'update']);
    Route::patch('/patients/{id}/dental-chart', [PatientController::class, 'updateDentalChart']);

    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
    Route::post('/appointments/{id}/treatment-lines', [AppointmentController::class, 'addTreatmentLine']);

    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    Route::get('/staff', [StaffController::class, 'index']);
    Route::post('/staff', [StaffController::class, 'store']);
    Route::put('/staff/{id}', [StaffController::class, 'update']);

    Route::get('/finance/cashbox', [FinanceController::class, 'cashbox']);
    Route::post('/finance/cashbox', [FinanceController::class, 'storeCashboxEntry']);
    Route::get('/finance/debtors', [FinanceController::class, 'debtors']);
    Route::get('/finance/pnl', [FinanceController::class, 'pnl']);

    Route::get('/inventory/materials', [InventoryController::class, 'materials']);
    Route::post('/inventory/materials', [InventoryController::class, 'storeMaterial']);
    Route::put('/inventory/materials/{id}', [InventoryController::class, 'updateMaterial']);
    Route::get('/inventory/suppliers', [InventoryController::class, 'suppliers']);
    Route::get('/inventory/documents', [InventoryController::class, 'documents']);
    Route::post('/inventory/documents', [InventoryController::class, 'storeDocument']);

    Route::get('/crm/leads', [CrmController::class, 'leads']);
    Route::post('/crm/leads', [CrmController::class, 'storeLead']);
    Route::patch('/crm/leads/{id}/stage', [CrmController::class, 'updateLeadStage']);
    Route::get('/crm/waitlist', [CrmController::class, 'waitlist']);
    Route::post('/crm/waitlist', [CrmController::class, 'storeWaitlist']);
    Route::get('/crm/tasks', [CrmController::class, 'tasks']);
    Route::patch('/crm/tasks/{id}/toggle', [CrmController::class, 'toggleTask']);

    Route::get('/marketing/campaigns', [MarketingController::class, 'campaigns']);
    Route::post('/marketing/campaigns', [MarketingController::class, 'storeCampaign']);
    Route::get('/marketing/groups', [MarketingController::class, 'groups']);
    Route::post('/marketing/groups', [MarketingController::class, 'storeGroup']);
    Route::get('/marketing/stats', [MarketingController::class, 'stats']);

    Route::get('/reports/by-doctor', [ReportController::class, 'byDoctor']);
    Route::get('/reports/by-service', [ReportController::class, 'byService']);
    Route::get('/reports/patients', [ReportController::class, 'patientsReport']);

    Route::get('/settings/branches', [SettingsController::class, 'branches']);
    Route::post('/settings/branches', [SettingsController::class, 'storeBranch']);
    Route::get('/settings/rbac', [SettingsController::class, 'rbac']);
    Route::post('/settings/rbac', [SettingsController::class, 'saveRbac']);
    Route::get('/settings/integrations', [SettingsController::class, 'integrations']);
});
