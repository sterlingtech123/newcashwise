// API Client for CashWise Backend Services
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'http://localhost:3003');

interface ApiResponse<T = any> {
  data: T;
  meta?: {
    page?: number;
    total?: number;
    limit?: number;
    totalPages?: number;
  };
  message?: string;
}

interface ApiError {
  code: string;
  message: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    tenantId?: string;
  }) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request('/api/v1/auth/me');
  }

  async logout() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: token }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request('/api/v1/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async forgotPassword(email: string) {
    return this.request('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: { token: string; newPassword: string }) {
    return this.request('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Budget endpoints
  async getBudgets(params?: {
    page?: number;
    limit?: number;
    department?: string;
    fiscalYear?: string;
    status?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/budgets${queryString}`);
  }

  async createBudget(budgetData: {
    title: string;
    department: string;
    fiscalYear: string;
    totalAmount: number;
    description?: string;
    categories: Array<{
      name: string;
      amount: number;
    }>;
  }) {
    return this.request('/api/v1/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  async getBudget(id: string) {
    return this.request(`/api/v1/budgets/${id}`);
  }

  async updateBudget(id: string, budgetData: Partial<any>) {
    return this.request(`/api/v1/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  }

  async deleteBudget(id: string) {
    return this.request(`/api/v1/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment/Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/transactions${queryString}`);
  }

  async createPayment(paymentData: {
    payeeName: string;
    payeeAccount: string;
    bankName: string;
    amount: number;
    description: string;
    category: string;
    budgetLine?: string;
    urgency: string;
  }) {
    return this.request('/api/v1/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPayment(id: string) {
    return this.request(`/api/v1/payments/${id}`);
  }

  async updatePayment(id: string, paymentData: Partial<any>) {
    return this.request(`/api/v1/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id: string) {
    return this.request(`/api/v1/payments/${id}`, {
      method: 'DELETE',
    });
  }

  // Journal Entries
  async getJournalEntries(params?: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/journal-entries${queryString}`);
  }

  async createJournalEntry(entryData: {
    description: string;
    reference: string;
    lines: Array<{
      accountId: string;
      debit?: number;
      credit?: number;
      description?: string;
    }>;
  }) {
    return this.request('/api/v1/journal-entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async getJournalEntry(id: string) {
    return this.request(`/api/v1/journal-entries/${id}`);
  }

  // Reports
  async generateReport(reportType: string, params?: any) {
    return this.request('/api/v1/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ type: reportType, ...params }),
    });
  }

  async getReports(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/reports${queryString}`);
  }

  async getReport(id: string) {
    return this.request(`/api/v1/reports/${id}`);
  }

  // Dashboard data
  async getDashboardData() {
    return this.request('/api/v1/dashboard');
  }

  // Bank accounts
  async getBankAccounts() {
    return this.request('/api/v1/bank/accounts');
  }

  async createBankAccount(accountData: {
    name: string;
    accountNumber: string;
    bankName: string;
    accountType: string;
    currency: string;
  }) {
    return this.request('/api/v1/bank/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async getBankAccount(id: string) {
    return this.request(`/api/v1/bank/accounts/${id}`);
  }

  async updateBankAccount(id: string, accountData: Partial<any>) {
    return this.request(`/api/v1/bank/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  }

  async deleteBankAccount(id: string) {
    return this.request(`/api/v1/bank/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Chart of Accounts
  async getChartOfAccounts() {
    return this.request('/api/v1/accounting/chart-of-accounts');
  }

  async createGLAccount(accountData: {
    code: string;
    name: string;
    type: string;
    parentId?: string;
  }) {
    return this.request('/api/v1/accounting/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  // Trial Balance
  async getTrialBalance(params?: {
    date?: string;
    includeZeroBalances?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/accounting/trial-balance${queryString}`);
  }

  // Reconciliation
  async getReconciliations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    accountId?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/accounting/reconciliations${queryString}`);
  }

  async createReconciliation(data: {
    accountId: string;
    statementDate: string;
    statementBalance: number;
  }) {
    return this.request('/api/v1/accounting/reconciliations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Workflow
  async getWorkflows(params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/workflows${queryString}`);
  }

  async createWorkflow(data: {
    type: string;
    title: string;
    description?: string;
    assigneeId?: string;
    priority: string;
  }) {
    return this.request('/api/v1/workflows', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Notifications
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    read?: boolean;
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/api/v1/notifications${queryString}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/api/v1/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/api/v1/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;