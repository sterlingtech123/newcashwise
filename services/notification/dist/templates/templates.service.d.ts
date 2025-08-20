import { Repository } from 'typeorm';
import { NotificationTemplate } from './entities/notification-template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class TemplatesService {
    private templateRepository;
    private tenantService;
    private auditService;
    constructor(templateRepository: Repository<NotificationTemplate>, tenantService: TenantService, auditService: AuditService);
    create(createTemplateDto: CreateTemplateDto): Promise<NotificationTemplate>;
    findAll(filters?: {
        category?: string;
        channel?: string;
        is_active?: boolean;
    }): Promise<NotificationTemplate[]>;
    findOne(id: string): Promise<NotificationTemplate>;
    findByName(name: string): Promise<NotificationTemplate>;
    update(id: string, updateData: Partial<CreateTemplateDto>): Promise<NotificationTemplate>;
    deactivate(id: string): Promise<NotificationTemplate>;
    preview(id: string, data: any): Promise<{
        subject: string;
        content: string;
        variables_used: string[];
        missing_variables: string[];
    }>;
    initializeSystemTemplates(): Promise<NotificationTemplate[]>;
    private getDefaultSystemTemplates;
}
