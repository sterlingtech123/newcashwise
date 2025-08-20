import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
export declare class AuditService {
    private auditLogRepository;
    constructor(auditLogRepository: Repository<AuditLog>);
    logAction(tenantId: string, userId: string, action: string, entityType: string, entityId: string, oldValues?: any, newValues?: any): Promise<void>;
}
