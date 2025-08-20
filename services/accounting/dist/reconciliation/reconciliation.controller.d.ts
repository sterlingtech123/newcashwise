import { ReconciliationService } from './reconciliation.service';
export declare class ReconciliationController {
    private readonly reconciliationService;
    constructor(reconciliationService: ReconciliationService);
    createReconciliation(): Promise<{
        message: string;
    }>;
}
