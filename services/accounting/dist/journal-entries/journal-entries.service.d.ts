import { Repository, DataSource } from 'typeorm';
import { JournalEntry } from './entities/journal-entry.entity';
import { JournalEntryLine } from './entities/journal-entry-line.entity';
import { GLAccount } from '../gl-accounts/entities/gl-account.entity';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class JournalEntriesService {
    private journalEntryRepository;
    private journalEntryLineRepository;
    private glAccountRepository;
    private dataSource;
    private tenantService;
    private auditService;
    constructor(journalEntryRepository: Repository<JournalEntry>, journalEntryLineRepository: Repository<JournalEntryLine>, glAccountRepository: Repository<GLAccount>, dataSource: DataSource, tenantService: TenantService, auditService: AuditService);
    create(createJournalEntryDto: CreateJournalEntryDto): Promise<JournalEntry>;
    findAll(page?: number, limit?: number, filters?: any): Promise<{
        data: JournalEntry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<JournalEntry>;
    postEntry(id: string): Promise<JournalEntry>;
    reverseEntry(id: string, reason: string): Promise<JournalEntry>;
    private validateJournalEntry;
    private calculateTotals;
    private generateReferenceNumber;
    private updateGLAccountBalances;
}
