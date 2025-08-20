import { BankAccountsService } from '../bank-accounts/bank-accounts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TenantService } from '../common/services/tenant.service';
export declare class TreasuryService {
    private bankAccountsService;
    private transactionsService;
    private tenantService;
    constructor(bankAccountsService: BankAccountsService, transactionsService: TransactionsService, tenantService: TenantService);
    getCashPosition(): Promise<{
        position_date: Date;
        status: string;
        total_current_balance: number;
        total_available_balance: number;
        account_count: number;
        currency_breakdown: Record<string, number>;
    }>;
    getCashForecast(days?: number): Promise<{
        current_position: number;
        forecast_days: number;
        projected_balance: number;
        forecast_data: any[];
        risk_alerts: any[];
    }>;
    getLiquidityAnalysis(): Promise<{
        total_liquid_funds: number;
        total_restricted_funds: number;
        minimum_required: number;
        excess_liquidity: number;
        liquidity_ratio: number;
        analysis_date: Date;
    }>;
}
