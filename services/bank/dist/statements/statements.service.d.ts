import { TenantService } from '../common/services/tenant.service';
export declare class StatementsService {
    private tenantService;
    constructor(tenantService: TenantService);
    processStatement(): Promise<{
        message: string;
    }>;
    parseCSVStatement(csvData: string): Promise<{
        message: string;
    }>;
    parseXMLStatement(xmlData: string): Promise<{
        message: string;
    }>;
}
