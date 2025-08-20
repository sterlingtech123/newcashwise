import { GLAccountsService } from './gl-accounts.service';
import { CreateGLAccountDto } from './dto/create-gl-account.dto';
import { GLAccount } from './entities/gl-account.entity';
export declare class GLAccountsController {
    private readonly glAccountsService;
    constructor(glAccountsService: GLAccountsService);
    create(createGLAccountDto: CreateGLAccountDto): Promise<GLAccount>;
    initializeDefault(): Promise<GLAccount[]>;
    findAll(account_type?: string, is_active?: boolean, parent_id?: string): Promise<GLAccount[]>;
    getChartOfAccounts(): Promise<GLAccount[]>;
    findOne(id: string): Promise<GLAccount>;
    getBalance(id: string, as_of_date?: string): Promise<{
        debit_balance: number;
        credit_balance: number;
        current_balance: number;
    }>;
    update(id: string, updateData: Partial<CreateGLAccountDto>): Promise<GLAccount>;
    deactivate(id: string): Promise<GLAccount>;
}
