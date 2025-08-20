import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { NotificationTemplate } from './entities/notification-template.entity';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    create(createTemplateDto: CreateTemplateDto): Promise<NotificationTemplate>;
    initializeSystemTemplates(): Promise<NotificationTemplate[]>;
    findAll(category?: string, channel?: string, is_active?: boolean): Promise<NotificationTemplate[]>;
    findOne(id: string): Promise<NotificationTemplate>;
    findByName(name: string): Promise<NotificationTemplate>;
    preview(id: string, data: any): Promise<{
        subject: string;
        content: string;
        variables_used: string[];
        missing_variables: string[];
    }>;
    update(id: string, updateData: Partial<CreateTemplateDto>): Promise<NotificationTemplate>;
    deactivate(id: string): Promise<NotificationTemplate>;
}
