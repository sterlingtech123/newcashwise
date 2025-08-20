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
var WorkflowsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkflowsService = WorkflowsService_1 = class WorkflowsService {
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.logger = new common_1.Logger(WorkflowsService_1.name);
    }
    async createApprovalPolicy(tenantId, createPolicyDto) {
        try {
            const policies = await this.prisma.$queryRaw `
        INSERT INTO workflow.approval_policies (
          tenant_id, name, description, policy_type, conditions, is_active, priority
        ) VALUES (
          ${tenantId}::uuid, ${createPolicyDto.name}, ${createPolicyDto.description},
          ${createPolicyDto.policyType}, ${JSON.stringify(createPolicyDto.conditions)},
          ${createPolicyDto.isActive ?? true}, ${createPolicyDto.priority ?? 0}
        ) RETURNING *
      `;
            const policy = policies[0];
            for (const [index, stage] of createPolicyDto.stages.entries()) {
                await this.prisma.$executeRaw `
          INSERT INTO workflow.approval_stages (
            tenant_id, policy_id, stage_order, stage_name, role_requirements,
            user_requirements, min_approvers, max_approvers, is_parallel, conditions
          ) VALUES (
            ${tenantId}::uuid, ${policy.id}::uuid, ${index + 1}, ${stage.stageName},
            ${JSON.stringify(stage.roleRequirements)}, ${JSON.stringify(stage.userRequirements || [])},
            ${stage.minApprovers ?? 1}, ${stage.maxApprovers ?? 1},
            ${stage.isParallel ?? false}, ${JSON.stringify(stage.conditions || {})}
          )
        `;
            }
            this.logger.log(`Approval policy created: ${policy.name}`);
            return policy;
        }
        catch (error) {
            this.logger.error('Error creating approval policy', error);
            throw error;
        }
    }
    async initiateWorkflow(tenantId, createWorkflowDto) {
        try {
            const policy = await this.findApplicablePolicy(tenantId, createWorkflowDto.entityType, createWorkflowDto.entityData);
            if (!policy) {
                throw new common_1.NotFoundException('No applicable approval policy found');
            }
            const workflowInstances = await this.prisma.$queryRaw `
        INSERT INTO workflow.workflow_instances (
          tenant_id, policy_id, entity_type, entity_id, status,
          initiated_by, metadata
        ) VALUES (
          ${tenantId}::uuid, ${policy.id}::uuid, ${createWorkflowDto.entityType},
          ${createWorkflowDto.entityId}::uuid, 'pending',
          ${createWorkflowDto.initiatedBy}::uuid, ${JSON.stringify(createWorkflowDto.metadata || {})}
        ) RETURNING *
      `;
            const workflowInstance = workflowInstances[0];
            const firstStages = await this.prisma.$queryRaw `
        SELECT * FROM workflow.approval_stages
        WHERE policy_id = ${policy.id}::uuid
        AND tenant_id = ${tenantId}::uuid
        ORDER BY stage_order
        LIMIT 1
      `;
            const firstStage = firstStages[0];
            if (firstStage) {
                await this.prisma.$executeRaw `
          UPDATE workflow.workflow_instances
          SET current_stage_id = ${firstStage.id}::uuid
          WHERE id = ${workflowInstance.id}::uuid
        `;
                await this.createApprovalTasks(tenantId, workflowInstance.id, firstStage);
            }
            else {
                await this.completeWorkflow(tenantId, workflowInstance.id, 'approved');
            }
            this.eventEmitter.emit('workflow.initiated', {
                tenantId,
                workflowInstance,
                policy,
            });
            return workflowInstance;
        }
        catch (error) {
            this.logger.error('Error initiating workflow', error);
            throw error;
        }
    }
    async approveTask(tenantId, taskId, approveTaskDto) {
        try {
            const tasks = await this.prisma.$queryRaw `
        SELECT at.*, wi.entity_type, wi.entity_id, wi.policy_id, wi.current_stage_id,
               ast.stage_order, ast.min_approvers, ast.max_approvers
        FROM workflow.approval_tasks at
        JOIN workflow.workflow_instances wi ON at.workflow_instance_id = wi.id
        JOIN workflow.approval_stages ast ON at.stage_id = ast.id
        WHERE at.id = ${taskId}::uuid
        AND at.tenant_id = ${tenantId}::uuid
        AND at.status = 'pending'
      `;
            const task = tasks[0];
            if (!task) {
                throw new common_1.NotFoundException('Task not found or already processed');
            }
            const canApprove = await this.canUserApproveTask(tenantId, taskId, approveTaskDto.userId);
            if (!canApprove) {
                throw new common_1.BadRequestException('User not authorized to approve this task');
            }
            await this.prisma.$executeRaw `
        UPDATE workflow.approval_tasks
        SET status = ${approveTaskDto.decision},
            comments = ${approveTaskDto.comments},
            decided_at = NOW()
        WHERE id = ${taskId}::uuid
      `;
            await this.prisma.$executeRaw `
        INSERT INTO workflow.approval_history (
          tenant_id, workflow_instance_id, stage_id, user_id, action, comments
        ) VALUES (
          ${tenantId}::uuid, ${task.workflow_instance_id}::uuid,
          ${task.stage_id}::uuid, ${approveTaskDto.userId}::uuid,
          ${approveTaskDto.decision}, ${approveTaskDto.comments}
        )
      `;
            const stageComplete = await this.checkStageCompletion(tenantId, task.workflow_instance_id, task.stage_id);
            if (stageComplete.isComplete) {
                if (stageComplete.decision === 'rejected') {
                    await this.completeWorkflow(tenantId, task.workflow_instance_id, 'rejected');
                }
                else {
                    await this.progressWorkflow(tenantId, task.workflow_instance_id);
                }
            }
            this.eventEmitter.emit('workflow.task.approved', {
                tenantId,
                taskId,
                decision: approveTaskDto.decision,
                workflowInstanceId: task.workflow_instance_id,
                entityType: task.entity_type,
                entityId: task.entity_id,
            });
            return { message: 'Task processed successfully', decision: approveTaskDto.decision };
        }
        catch (error) {
            this.logger.error('Error approving task', error);
            throw error;
        }
    }
    async getUserTasks(tenantId, userId, status) {
        let whereClause = `
      WHERE at.tenant_id = ${tenantId}::uuid
      AND (at.assigned_to = ${userId}::uuid 
           OR ast.role_requirements ?| (
             SELECT array_agg(r.name) 
             FROM auth.user_roles ur 
             JOIN auth.roles r ON ur.role_id = r.id 
             WHERE ur.user_id = ${userId}::uuid
           ))
    `;
        if (status) {
            whereClause += ` AND at.status = '${status}'`;
        }
        const query = `
      SELECT 
        at.*,
        wi.entity_type,
        wi.entity_id,
        wi.initiated_at,
        ast.stage_name,
        ap.name as policy_name,
        CASE 
          WHEN wi.entity_type = 'payment_voucher' THEN 
            (SELECT json_build_object(
              'pv_number', pv.pv_number,
              'amount', pv.net_amount,
              'vendor', v.name,
              'description', pv.description
            ) FROM payment.payment_vouchers pv 
            LEFT JOIN payment.vendors v ON pv.vendor_id = v.id
            WHERE pv.id = wi.entity_id::uuid)
          WHEN wi.entity_type = 'invoice' THEN
            (SELECT json_build_object(
              'invoice_number', i.invoice_number,
              'amount', i.net_amount,
              'vendor', v.name,
              'description', i.description
            ) FROM payment.invoices i
            LEFT JOIN payment.vendors v ON i.vendor_id = v.id
            WHERE i.id = wi.entity_id::uuid)
          ELSE '{}'::json
        END as entity_details
      FROM workflow.approval_tasks at
      JOIN workflow.workflow_instances wi ON at.workflow_instance_id = wi.id
      JOIN workflow.approval_stages ast ON at.stage_id = ast.id
      JOIN workflow.approval_policies ap ON wi.policy_id = ap.id
      ${whereClause}
      ORDER BY at.created_at DESC
    `;
        return this.prisma.$queryRawUnsafe(query);
    }
    async getWorkflowHistory(tenantId, entityType, entityId) {
        return this.prisma.$queryRaw `
      SELECT 
        ah.*,
        u.first_name,
        u.last_name,
        u.email,
        ast.stage_name,
        ast.stage_order
      FROM workflow.approval_history ah
      JOIN workflow.workflow_instances wi ON ah.workflow_instance_id = wi.id
      JOIN auth.users u ON ah.user_id = u.id
      JOIN workflow.approval_stages ast ON ah.stage_id = ast.id
      WHERE wi.tenant_id = ${tenantId}::uuid
      AND wi.entity_type = ${entityType}
      AND wi.entity_id = ${entityId}::uuid
      ORDER BY ah.created_at DESC
    `;
    }
    async checkOverdueTasks() {
        this.logger.log('Checking for overdue approval tasks');
        const overdueTasks = await this.prisma.$queryRaw `
      SELECT 
        at.*,
        wi.entity_type,
        wi.entity_id,
        u.email,
        u.first_name,
        u.last_name
      FROM workflow.approval_tasks at
      JOIN workflow.workflow_instances wi ON at.workflow_instance_id = wi.id
      LEFT JOIN auth.users u ON at.assigned_to = u.id
      WHERE at.status = 'pending'
      AND at.due_date < NOW()
      AND at.due_date IS NOT NULL
    `;
        for (const task of overdueTasks) {
            this.eventEmitter.emit('workflow.task.overdue', {
                task,
                user: task.email ? {
                    email: task.email,
                    firstName: task.first_name,
                    lastName: task.last_name,
                } : null,
            });
        }
        this.logger.log(`Found ${overdueTasks.length} overdue tasks`);
    }
    async findApplicablePolicy(tenantId, entityType, entityData) {
        const policies = await this.prisma.$queryRaw `
      SELECT * FROM workflow.approval_policies
      WHERE tenant_id = ${tenantId}::uuid
      AND policy_type = ${entityType}
      AND is_active = true
      ORDER BY priority DESC
    `;
        for (const policy of policies) {
            if (this.evaluateConditions(policy.conditions, entityData)) {
                return policy;
            }
        }
        return null;
    }
    evaluateConditions(conditions, entityData) {
        if (!conditions || Object.keys(conditions).length === 0) {
            return true;
        }
        if (conditions.minAmount && entityData.amount < conditions.minAmount) {
            return false;
        }
        if (conditions.maxAmount && entityData.amount > conditions.maxAmount) {
            return false;
        }
        if (conditions.organizations && !conditions.organizations.includes(entityData.organizationId)) {
            return false;
        }
        if (conditions.economicHeads && !conditions.economicHeads.includes(entityData.economicHeadId)) {
            return false;
        }
        if (conditions.minRiskScore && entityData.riskScore < conditions.minRiskScore) {
            return false;
        }
        return true;
    }
    async createApprovalTasks(tenantId, workflowInstanceId, stage) {
        const stageRequirements = stage.role_requirements || [];
        const userRequirements = stage.user_requirements || [];
        for (const userId of userRequirements) {
            await this.prisma.$executeRaw `
        INSERT INTO workflow.approval_tasks (
          tenant_id, workflow_instance_id, stage_id, assigned_to, status, due_date
        ) VALUES (
          ${tenantId}::uuid, ${workflowInstanceId}::uuid, ${stage.id}::uuid,
          ${userId}::uuid, 'pending', NOW() + INTERVAL '3 days'
        )
      `;
        }
        if (stageRequirements.length > 0 && userRequirements.length === 0) {
            const eligibleUsers = await this.prisma.$queryRaw `
        SELECT DISTINCT u.id, u.email
        FROM auth.users u
        JOIN auth.user_roles ur ON u.id = ur.user_id
        JOIN auth.roles r ON ur.role_id = r.id
        WHERE u.tenant_id = ${tenantId}::uuid
        AND r.name = ANY(${stageRequirements})
        AND u.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
      `;
            if (stage.is_parallel) {
                for (const user of eligibleUsers) {
                    await this.prisma.$executeRaw `
            INSERT INTO workflow.approval_tasks (
              tenant_id, workflow_instance_id, stage_id, assigned_to, assigned_role, status, due_date
            ) VALUES (
              ${tenantId}::uuid, ${workflowInstanceId}::uuid, ${stage.id}::uuid,
              ${user.id}::uuid, ${stageRequirements[0]}, 'pending', NOW() + INTERVAL '3 days'
            )
          `;
                }
            }
            else {
                await this.prisma.$executeRaw `
          INSERT INTO workflow.approval_tasks (
            tenant_id, workflow_instance_id, stage_id, assigned_role, status, due_date
          ) VALUES (
            ${tenantId}::uuid, ${workflowInstanceId}::uuid, ${stage.id}::uuid,
            ${stageRequirements[0]}, 'pending', NOW() + INTERVAL '3 days'
          )
        `;
            }
        }
    }
    async canUserApproveTask(tenantId, taskId, userId) {
        const [result] = await this.prisma.$queryRaw `
      SELECT workflow.can_user_approve_task(${taskId}::uuid, ${userId}::uuid) as can_approve
    `;
        return result?.can_approve || false;
    }
    async checkStageCompletion(tenantId, workflowInstanceId, stageId) {
        const stageTasks = await this.prisma.$queryRaw `
      SELECT 
        at.*,
        ast.min_approvers,
        ast.max_approvers,
        ast.is_parallel
      FROM workflow.approval_tasks at
      JOIN workflow.approval_stages ast ON at.stage_id = ast.id
      WHERE at.workflow_instance_id = ${workflowInstanceId}::uuid
      AND at.stage_id = ${stageId}::uuid
      AND at.tenant_id = ${tenantId}::uuid
    `;
        const tasks = stageTasks;
        const approvedTasks = tasks.filter(t => t.status === 'approved');
        const rejectedTasks = tasks.filter(t => t.status === 'rejected');
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        if (rejectedTasks.length > 0) {
            return { isComplete: true, decision: 'rejected' };
        }
        const minApprovers = tasks[0]?.min_approvers || 1;
        const isParallel = tasks[0]?.is_parallel || false;
        if (isParallel) {
            if (pendingTasks.length === 0 && approvedTasks.length === tasks.length) {
                return { isComplete: true, decision: 'approved' };
            }
        }
        else {
            if (approvedTasks.length >= minApprovers) {
                return { isComplete: true, decision: 'approved' };
            }
        }
        return { isComplete: false, decision: null };
    }
    async progressWorkflow(tenantId, workflowInstanceId) {
        const [nextStage] = await this.prisma.$queryRaw `
      SELECT ast2.*
      FROM workflow.workflow_instances wi
      JOIN workflow.approval_stages ast1 ON wi.current_stage_id = ast1.id
      JOIN workflow.approval_stages ast2 ON ast1.policy_id = ast2.policy_id
      WHERE wi.id = ${workflowInstanceId}::uuid
      AND wi.tenant_id = ${tenantId}::uuid
      AND ast2.stage_order = ast1.stage_order + 1
    `;
        if (nextStage) {
            await this.prisma.$executeRaw `
        UPDATE workflow.workflow_instances
        SET current_stage_id = ${nextStage.id}::uuid
        WHERE id = ${workflowInstanceId}::uuid
      `;
            await this.createApprovalTasks(tenantId, workflowInstanceId, nextStage);
        }
        else {
            await this.completeWorkflow(tenantId, workflowInstanceId, 'approved');
        }
    }
    async completeWorkflow(tenantId, workflowInstanceId, status) {
        await this.prisma.$executeRaw `
      UPDATE workflow.workflow_instances
      SET status = ${status},
          completed_at = NOW()
      WHERE id = ${workflowInstanceId}::uuid
      AND tenant_id = ${tenantId}::uuid
    `;
        const [workflow] = await this.prisma.$queryRaw `
      SELECT * FROM workflow.workflow_instances
      WHERE id = ${workflowInstanceId}::uuid
      AND tenant_id = ${tenantId}::uuid
    `;
        this.eventEmitter.emit('workflow.completed', {
            tenantId,
            workflowInstance: workflow,
            status,
        });
        this.logger.log(`Workflow ${workflowInstanceId} completed with status: ${status}`);
    }
};
exports.WorkflowsService = WorkflowsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WorkflowsService.prototype, "checkOverdueTasks", null);
exports.WorkflowsService = WorkflowsService = WorkflowsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map