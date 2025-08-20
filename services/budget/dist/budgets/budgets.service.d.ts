import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { CreateBudgetLineDto } from './dto/create-budget-line.dto';
import { CreateAllotmentDto } from './dto/create-allotment.dto';
import { CreateCommitmentDto } from './dto/create-commitment.dto';
import { BudgetAvailabilityDto } from './dto/budget-availability.dto';
export declare class BudgetsService {
    private prisma;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    createBudgetVersion(tenantId: string, createBudgetDto: CreateBudgetDto): Promise<any>;
    createBudgetLine(tenantId: string, createBudgetLineDto: CreateBudgetLineDto): Promise<{
        [key: string]: any;
        line_number: string;
    }>;
    createAllotment(tenantId: string, createAllotmentDto: CreateAllotmentDto): Promise<{
        [key: string]: any;
        reference_number: string;
    }>;
    createCommitment(tenantId: string, createCommitmentDto: CreateCommitmentDto): Promise<{
        [key: string]: any;
        reference_number: string;
    }>;
    checkBudgetAvailability(tenantId: string, budgetLineId: string, requestedAmount: number): Promise<BudgetAvailabilityDto>;
    getBudgetUtilization(tenantId: string, organizationId?: string, fiscalYear?: number): Promise<unknown>;
    getBudgetPipeline(tenantId: string, organizationId?: string): Promise<unknown>;
    importBudgetFromCSV(tenantId: string, fileBuffer: Buffer, budgetVersionId: string): Promise<{
        message: string;
        budgetVersionId: string;
        status: string;
    }>;
    approveBudgetVersion(tenantId: string, budgetVersionId: string, approvedBy: string): Promise<any>;
    releaseCommitment(tenantId: string, commitmentId: string, amount?: number): Promise<{
        message: string;
        releaseAmount: number;
        remainingCommitment: number;
    }>;
    private validateBudgetLineReferences;
    private updateBudgetVersionTotal;
}
