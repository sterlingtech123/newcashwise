import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

// Dashboard Data Hook
export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => apiClient.getDashboardData(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 3,
  });
}

// Budgets Hook
export function useBudgets(params?: {
  page?: number;
  limit?: number;
  department?: string;
  fiscalYear?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['budgets', params],
    queryFn: () => apiClient.getBudgets(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

// Single Budget Hook
export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => apiClient.getBudget(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Create Budget Hook
export function useCreateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createBudget(data),
    onSuccess: () => {
      toast.success('Budget created successfully!');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create budget');
      console.error('Create budget error:', error);
    },
  });
}

// Update Budget Hook
export function useUpdateBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiClient.updateBudget(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Budget updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to update budget');
      console.error('Update budget error:', error);
    },
  });
}

// Delete Budget Hook
export function useDeleteBudget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteBudget(id),
    onSuccess: () => {
      toast.success('Budget deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to delete budget');
      console.error('Delete budget error:', error);
    },
  });
}

// Transactions Hook
export function useTransactions(params?: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => apiClient.getTransactions(params),
    staleTime: 1 * 60 * 1000, // 1 minute
    retry: 2,
  });
}

// Create Payment Hook
export function useCreatePayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createPayment(data),
    onSuccess: () => {
      toast.success('Payment created successfully!');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create payment');
      console.error('Create payment error:', error);
    },
  });
}

// Reports Hook
export function useReports(params?: {
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  department?: string;
}) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => apiClient.getReports(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Generate Report Hook
export function useGenerateReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.generateReport(data.type, data.params),
    onSuccess: () => {
      toast.success('Report generated successfully!');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
    onError: (error: any) => {
      toast.error('Failed to generate report');
      console.error('Generate report error:', error);
    },
  });
}

// Bank Accounts Hook
export function useBankAccounts() {
  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: () => apiClient.getBankAccounts(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// Create Bank Account Hook
export function useCreateBankAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createBankAccount(data),
    onSuccess: () => {
      toast.success('Bank account created successfully!');
      queryClient.invalidateQueries({ queryKey: ['bank-accounts'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create bank account');
      console.error('Create bank account error:', error);
    },
  });
}

// Journal Entries Hook
export function useJournalEntries(params?: {
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: ['journal-entries', params],
    queryFn: () => apiClient.getJournalEntries(params),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

// Create Journal Entry Hook
export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiClient.createJournalEntry(data),
    onSuccess: () => {
      toast.success('Journal entry created successfully!');
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create journal entry');
      console.error('Create journal entry error:', error);
    },
  });
}
