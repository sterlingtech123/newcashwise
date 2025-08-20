import { Repository } from 'typeorm';
import { GLAccount } from './entities/gl-account.entity';
import { CreateGLAccountDto } from './dto/create-gl-account.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class GLAccountsService {
    private glAccountRepository;
    private tenantService;
    private auditService;
    constructor(glAccountRepository: Repository<GLAccount>, tenantService: TenantService, auditService: AuditService);
    create(createGLAccountDto: CreateGLAccountDto): Promise<GLAccount>;
    findAll(filters?: {
        account_type?: string;
        is_active?: boolean;
        parent_id?: string;
    }): Promise<GLAccount[]>;
    findOne(id: string): Promise<GLAccount>;
    update(id: string, updateData: Partial<CreateGLAccountDto>): Promise<GLAccount>;
    deactivate(id: string): Promise<GLAccount>;
    getChartOfAccounts(): Promise<GLAccount[]>;
    getAccountBalance(accountId: string, asOfDate?: Date): Promise<{
        debit_balance: number;
        credit_balance: number;
        current_balance: number;
    }>;
    initializeDefaultChart(): Promise<GLAccount[]>;
    private getDefaultNormalBalance;
    private getDefaultChartOfAccounts;
}
