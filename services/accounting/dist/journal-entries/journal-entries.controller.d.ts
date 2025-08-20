import { JournalEntriesService } from './journal-entries.service';
import { CreateJournalEntryDto } from './dto/create-journal-entry.dto';
import { JournalEntry } from './entities/journal-entry.entity';
export declare class JournalEntriesController {
    private readonly journalEntriesService;
    constructor(journalEntriesService: JournalEntriesService);
    create(createJournalEntryDto: CreateJournalEntryDto): Promise<JournalEntry>;
    findAll(page?: number, limit?: number, status?: string, source_type?: string, date_from?: string, date_to?: string): Promise<{
        data: JournalEntry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<JournalEntry>;
    postEntry(id: string): Promise<JournalEntry>;
    reverseEntry(id: string, body: {
        reason: string;
    }): Promise<JournalEntry>;
}
