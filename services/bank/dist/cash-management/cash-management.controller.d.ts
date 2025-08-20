import { CashManagementService } from './cash-management.service';
export declare class CashManagementController {
    private readonly cashManagementService;
    constructor(cashManagementService: CashManagementService);
    optimizeCashAllocation(): Promise<{
        message: string;
    }>;
    getInvestmentOpportunities(): Promise<{
        message: string;
    }>;
}
