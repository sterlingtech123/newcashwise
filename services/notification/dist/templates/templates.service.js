"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_template_entity_1 = require("./entities/notification-template.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let TemplatesService = class TemplatesService {
    constructor(templateRepository, tenantService, auditService) {
        this.templateRepository = templateRepository;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createTemplateDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const existingTemplate = await this.templateRepository.findOne({
            where: {
                name: createTemplateDto.name,
                tenant_id: tenantId,
            },
        });
        if (existingTemplate) {
            throw new common_1.BadRequestException(`Template with name '${createTemplateDto.name}' already exists`);
        }
        const template = this.templateRepository.create({
            ...createTemplateDto,
            tenant_id: tenantId,
            is_active: createTemplateDto.is_active !== false,
            is_system: false,
            created_by: userId,
        });
        const savedTemplate = await this.templateRepository.save(template);
        await this.auditService.logAction(tenantId, userId, 'CREATE', 'NotificationTemplate', savedTemplate.id, null, savedTemplate);
        return savedTemplate;
    }
    async findAll(filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.templateRepository
            .createQueryBuilder('template')
            .where('template.tenant_id = :tenantId', { tenantId })
            .orderBy('template.category', 'ASC')
            .addOrderBy('template.name', 'ASC');
        if (filters?.category) {
            queryBuilder.andWhere('template.category = :category', {
                category: filters.category
            });
        }
        if (filters?.channel) {
            queryBuilder.andWhere('template.channel = :channel', {
                channel: filters.channel
            });
        }
        if (filters?.is_active !== undefined) {
            queryBuilder.andWhere('template.is_active = :is_active', {
                is_active: filters.is_active
            });
        }
        return queryBuilder.getMany();
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const template = await this.templateRepository.findOne({
            where: { id, tenant_id: tenantId },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template with ID ${id} not found`);
        }
        return template;
    }
    async findByName(name) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const template = await this.templateRepository.findOne({
            where: { name, tenant_id: tenantId, is_active: true },
        });
        if (!template) {
            throw new common_1.NotFoundException(`Template with name '${name}' not found`);
        }
        return template;
    }
    async update(id, updateData) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const template = await this.findOne(id);
        if (template.is_system) {
            throw new common_1.BadRequestException('System templates cannot be modified');
        }
        if (updateData.name && updateData.name !== template.name) {
            const existingTemplate = await this.templateRepository.findOne({
                where: {
                    name: updateData.name,
                    tenant_id: tenantId,
                },
            });
            if (existingTemplate) {
                throw new common_1.BadRequestException(`Template with name '${updateData.name}' already exists`);
            }
        }
        const oldValues = { ...template };
        Object.assign(template, updateData);
        template.updated_by = userId;
        const updatedTemplate = await this.templateRepository.save(template);
        await this.auditService.logAction(tenantId, userId, 'UPDATE', 'NotificationTemplate', id, oldValues, updatedTemplate);
        return updatedTemplate;
    }
    async deactivate(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const template = await this.findOne(id);
        if (template.is_system) {
            throw new common_1.BadRequestException('System templates cannot be deactivated');
        }
        const oldValues = { is_active: template.is_active };
        template.is_active = false;
        template.updated_by = userId;
        const deactivatedTemplate = await this.templateRepository.save(template);
        await this.auditService.logAction(tenantId, userId, 'DEACTIVATE', 'NotificationTemplate', id, oldValues, { is_active: false });
        return deactivatedTemplate;
    }
    async preview(id, data) {
        const template = await this.findOne(id);
        const validation = template.validateData(data);
        return {
            subject: template.renderSubject(data),
            content: template.renderContent(data),
            variables_used: template.getVariableList(),
            missing_variables: validation.missingVariables,
        };
    }
    async initializeSystemTemplates() {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const existingSystemTemplates = await this.templateRepository.count({
            where: { tenant_id: tenantId, is_system: true },
        });
        if (existingSystemTemplates > 0) {
            throw new common_1.BadRequestException('System templates already exist');
        }
        const systemTemplates = this.getDefaultSystemTemplates();
        const createdTemplates = [];
        for (const templateData of systemTemplates) {
            const template = this.templateRepository.create({
                ...templateData,
                tenant_id: tenantId,
                is_system: true,
                is_active: true,
                created_by: userId,
            });
            const savedTemplate = await this.templateRepository.save(template);
            createdTemplates.push(savedTemplate);
        }
        return createdTemplates;
    }
    getDefaultSystemTemplates() {
        return [
            {
                name: 'payment_approved_email',
                description: 'Email notification when payment is approved',
                category: 'payment',
                channel: 'email',
                subject_template: 'Payment Approved - {{reference_number}}',
                content_template: `
          <h2>Payment Approved</h2>
          <p>Dear {{recipient_name}},</p>
          <p>Your payment voucher <strong>{{reference_number}}</strong> has been approved.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Amount: {{amount}}</li>
            <li>Beneficiary: {{beneficiary_name}}</li>
            <li>Approved by: {{approver_name}}</li>
            <li>Approved on: {{approval_date}}</li>
          </ul>
          <p>The payment will be processed shortly.</p>
          <p>Best regards,<br>CashWise Team</p>
        `,
                variables: ['recipient_name', 'reference_number', 'amount', 'beneficiary_name', 'approver_name', 'approval_date'],
                default_data: {},
            },
            {
                name: 'payment_rejected_email',
                description: 'Email notification when payment is rejected',
                category: 'payment',
                channel: 'email',
                subject_template: 'Payment Rejected - {{reference_number}}',
                content_template: `
          <h2>Payment Rejected</h2>
          <p>Dear {{recipient_name}},</p>
          <p>Your payment voucher <strong>{{reference_number}}</strong> has been rejected.</p>
          <p><strong>Reason:</strong> {{rejection_reason}}</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Amount: {{amount}}</li>
            <li>Beneficiary: {{beneficiary_name}}</li>
            <li>Rejected by: {{rejector_name}}</li>
            <li>Rejected on: {{rejection_date}}</li>
          </ul>
          <p>Please review and resubmit if necessary.</p>
          <p>Best regards,<br>CashWise Team</p>
        `,
                variables: ['recipient_name', 'reference_number', 'amount', 'beneficiary_name', 'rejector_name', 'rejection_date', 'rejection_reason'],
                default_data: {},
            },
            {
                name: 'budget_threshold_alert_email',
                description: 'Email alert when budget threshold is exceeded',
                category: 'budget',
                channel: 'email',
                subject_template: 'Budget Alert - {{budget_line_name}}',
                content_template: `
          <h2>Budget Threshold Alert</h2>
          <p>Dear {{recipient_name}},</p>
          <p>The budget line <strong>{{budget_line_name}}</strong> has exceeded {{threshold_percentage}}% utilization.</p>
          <p><strong>Current Status:</strong></p>
          <ul>
            <li>Approved Amount: {{approved_amount}}</li>
            <li>Utilized Amount: {{utilized_amount}}</li>
            <li>Utilization Rate: {{utilization_percentage}}%</li>
            <li>Remaining Amount: {{remaining_amount}}</li>
          </ul>
          <p>Please monitor spending closely to avoid budget overruns.</p>
          <p>Best regards,<br>CashWise Team</p>
        `,
                variables: ['recipient_name', 'budget_line_name', 'threshold_percentage', 'approved_amount', 'utilized_amount', 'utilization_percentage', 'remaining_amount'],
                default_data: {},
            },
            {
                name: 'workflow_task_assigned_email',
                description: 'Email notification when workflow task is assigned',
                category: 'workflow',
                channel: 'email',
                subject_template: 'New Task Assigned - {{task_title}}',
                content_template: `
          <h2>New Task Assigned</h2>
          <p>Dear {{recipient_name}},</p>
          <p>A new task has been assigned to you: <strong>{{task_title}}</strong></p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Entity: {{entity_type}} - {{entity_reference}}</li>
            <li>Due Date: {{due_date}}</li>
            <li>Priority: {{priority}}</li>
            <li>Assigned by: {{assigner_name}}</li>
          </ul>
          <p>Please log in to CashWise to review and take action.</p>
          <p>Best regards,<br>CashWise Team</p>
        `,
                variables: ['recipient_name', 'task_title', 'entity_type', 'entity_reference', 'due_date', 'priority', 'assigner_name'],
                default_data: {},
            },
            {
                name: 'system_maintenance_in_app',
                description: 'In-app notification for system maintenance',
                category: 'system',
                channel: 'in_app',
                subject_template: 'System Maintenance Notice',
                content_template: 'System maintenance is scheduled for {{maintenance_date}} from {{start_time}} to {{end_time}}. Some features may be unavailable during this period.',
                variables: ['maintenance_date', 'start_time', 'end_time'],
                default_data: {},
            },
        ];
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_template_entity_1.NotificationTemplate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map