import { TenantService } from '../common/services/tenant.service';
export declare class ReconciliationService {
    private tenantService;
    constructor(tenantService: TenantService);
    createReconciliation(): Promise<{
        message: string;
    }>;
}
