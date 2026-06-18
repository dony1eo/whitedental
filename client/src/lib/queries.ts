import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Dashboard
export const useDashboard = () => useQuery({ queryKey: ['dashboard'], queryFn: () => api.get('/dashboard/overview').then(r => r.data) });

// Patients
export const usePatients = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['patients', params], queryFn: () => api.get('/patients', { params }).then(r => r.data) });

export const usePatient = (id: number) =>
  useQuery({ queryKey: ['patient', id], queryFn: () => api.get(`/patients/${id}`).then(r => r.data), enabled: !!id });

export const useCreatePatient = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/patients', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patients'] }) });
};

export const useUpdatePatient = (id: number) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.put(`/patients/${id}`, data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['patient', id] }) });
};

// Appointments
export const useAppointments = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['appointments', params], queryFn: () => api.get('/appointments', { params }).then(r => r.data) });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/appointments', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }) });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...data }: { id: number } & Record<string, unknown>) => api.put(`/appointments/${id}`, data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }) });
};

export const useDeleteAppointment = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/appointments/${id}`).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }) });
};

// Services
export const useServices = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['services', params], queryFn: () => api.get('/services', { params }).then(r => r.data) });

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/services', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, ...data }: { id: number } & Record<string, unknown>) => api.put(`/services/${id}`, data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.delete(`/services/${id}`).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }) });
};

// Staff
export const useStaff = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['staff', params], queryFn: () => api.get('/staff', { params }).then(r => r.data) });

export const useCreateStaff = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/staff', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }) });
};

// Finance
export const useCashbox = (date?: string) =>
  useQuery({ queryKey: ['cashbox', date], queryFn: () => api.get('/finance/cashbox', { params: { date } }).then(r => r.data) });

export const usePnl = (month?: number, year?: number) =>
  useQuery({ queryKey: ['pnl', month, year], queryFn: () => api.get('/finance/pnl', { params: { month, year } }).then(r => r.data) });

export const useDebtors = () =>
  useQuery({ queryKey: ['debtors'], queryFn: () => api.get('/finance/debtors').then(r => r.data) });

export const useCreateCashEntry = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/finance/cashbox', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['cashbox'] }) });
};

// Inventory
export const useMaterials = (params?: Record<string, unknown>) =>
  useQuery({ queryKey: ['materials', params], queryFn: () => api.get('/inventory/materials', { params }).then(r => r.data) });

export const useCreateMaterial = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/inventory/materials', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['materials'] }) });
};

export const useSuppliers = () =>
  useQuery({ queryKey: ['suppliers'], queryFn: () => api.get('/inventory/suppliers').then(r => r.data) });

export const useWarehouseDocs = () =>
  useQuery({ queryKey: ['warehouse-docs'], queryFn: () => api.get('/inventory/documents').then(r => r.data) });

export const useCreateWarehouseDoc = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/inventory/documents', data).then(r => r.data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['warehouse-docs'] }); qc.invalidateQueries({ queryKey: ['materials'] }); } });
};

// CRM
export const useLeads = () =>
  useQuery({ queryKey: ['leads'], queryFn: () => api.get('/crm/leads').then(r => r.data) });

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/crm/leads', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }) });
};

export const useUpdateLeadStage = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, stage }: { id: number; stage: number }) => api.patch(`/crm/leads/${id}/stage`, { stage }).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }) });
};

export const useTasks = () =>
  useQuery({ queryKey: ['tasks'], queryFn: () => api.get('/crm/tasks').then(r => r.data) });

export const useToggleTask = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number) => api.patch(`/crm/tasks/${id}/toggle`).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) });
};

export const useWaitlist = () =>
  useQuery({ queryKey: ['waitlist'], queryFn: () => api.get('/crm/waitlist').then(r => r.data) });

export const useCreateWaitlist = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/crm/waitlist', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['waitlist'] }) });
};

// Marketing
export const useCampaigns = () =>
  useQuery({ queryKey: ['campaigns'], queryFn: () => api.get('/marketing/campaigns').then(r => r.data) });

export const usePatientGroups = () =>
  useQuery({ queryKey: ['patient-groups'], queryFn: () => api.get('/marketing/groups').then(r => r.data) });

// Reports
export const useReportByDoctor = (month?: number, year?: number) =>
  useQuery({ queryKey: ['report-by-doctor', month, year], queryFn: () => api.get('/reports/by-doctor', { params: { month, year } }).then(r => r.data) });

// Settings
export const useBranches = () =>
  useQuery({ queryKey: ['branches'], queryFn: () => api.get('/settings/branches').then(r => r.data) });

export const useIntegrations = () =>
  useQuery({ queryKey: ['integrations'], queryFn: () => api.get('/settings/integrations').then(r => r.data) });

export const useRbac = () =>
  useQuery({ queryKey: ['rbac'], queryFn: () => api.get('/settings/rbac').then(r => r.data) });

export const useSaveRbac = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: unknown) => api.post('/settings/rbac', data).then(r => r.data), onSuccess: () => qc.invalidateQueries({ queryKey: ['rbac'] }) });
};
