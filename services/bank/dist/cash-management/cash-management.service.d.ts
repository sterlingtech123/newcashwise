import { TenantService } from '../common/services/tenant.service';
export declare class CashManagementService {
    private tenantService;
    constructor(tenantService: TenantService);
    optimizeCashAllocation(): Promise<{
        message: string;
    }>;
    getInvestmentOpportunities(): Promise<{
        message: string;
    }>;
}
