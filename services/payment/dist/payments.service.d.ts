import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentVoucherDto } from './dto/create-payment-voucher.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
export declare class PaymentsService {
    private prisma;
    private eventEmitter;
    private paymentQueue;
    private glQueue;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2, paymentQueue: Queue, glQueue: Queue);
    createInvoice(tenantId: string, createInvoiceDto: CreateInvoiceDto): Promise<any>;
    createPaymentVoucher(tenantId: string, createPvDto: CreatePaymentVoucherDto): Promise<any>;
    processPayment(tenantId: string, pvId: string, processPaymentDto: ProcessPaymentDto): Promise<{
        payment: any;
        warrant: any;
    }>;
    getPaymentStatus(tenantId: string, paymentId: string): Promise<any>;
    getVendorPayments(tenantId: string, vendorId: string, limit?: number, offset?: number): Promise<any>;
    handleWorkflowCompleted(event: any): Promise<void>;
    private checkBudgetAvailability;
    private createBudgetCommitment;
    private initiateApprovalWorkflow;
    private processPaymentObligations;
    private releaseBudgetCommitments;
    private generatePvNumber;
    private generateWarrantNumber;
    private generatePaymentReference;
}
