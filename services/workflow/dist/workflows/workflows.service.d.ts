import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { CreateWorkflowInstanceDto } from './dto/create-workflow-instance.dto';
import { ApproveTaskDto } from './dto/approve-task.dto';
export declare class WorkflowsService {
    private prisma;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    createApprovalPolicy(tenantId: string, createPolicyDto: CreatePolicyDto): Promise<any>;
    initiateWorkflow(tenantId: string, createWorkflowDto: CreateWorkflowInstanceDto): Promise<any>;
    approveTask(tenantId: string, taskId: string, approveTaskDto: ApproveTaskDto): Promise<{
        message: string;
        decision: "approved" | "rejected";
    }>;
    getUserTasks(tenantId: string, userId: string, status?: string): Promise<unknown>;
    getWorkflowHistory(tenantId: string, entityType: string, entityId: string): Promise<unknown>;
    checkOverdueTasks(): Promise<void>;
    private findApplicablePolicy;
    private evaluateConditions;
    private createApprovalTasks;
    private canUserApproveTask;
    private checkStageCompletion;
    private progressWorkflow;
    private completeWorkflow;
}
