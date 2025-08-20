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
var PaymentsService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const bull_1 = require("@nestjs/bull");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(prisma, eventEmitter, paymentQueue, glQueue) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.paymentQueue = paymentQueue;
        this.glQueue = glQueue;
        this.logger = new common_1.Logger(PaymentsService_1.name);
    }
    async createInvoice(tenantId, createInvoiceDto) {
        try {
            const [vendor] = await this.prisma.$queryRaw `
        SELECT * FROM payment.vendors 
        WHERE id = ${createInvoiceDto.vendorId}::uuid 
        AND tenant_id = ${tenantId}::uuid
        AND status = 'active'
      `;
            if (!vendor) {
                throw new common_1.NotFoundException('Active vendor not found');
            }
            const [existing] = await this.prisma.$queryRaw `
        SELECT id FROM payment.invoices 
        WHERE tenant_id = ${tenantId}::uuid 
        AND invoice_number = ${createInvoiceDto.invoiceNumber}
      `;
            if (existing) {
                throw new common_1.BadRequestException('Invoice number already exists');
            }
            const [invoice] = await this.prisma.$queryRaw `
        INSERT INTO payment.invoices (
          tenant_id, invoice_number, vendor_id, organization_id,
          invoice_date, due_date, description, gross_amount, tax_amount,
          net_amount, currency, status, created_by
        ) VALUES (
          ${tenantId}::uuid, ${createInvoiceDto.invoiceNumber},
          ${createInvoiceDto.vendorId}::uuid, ${createInvoiceDto.organizationId}::uuid,
          ${createInvoiceDto.invoiceDate}, ${createInvoiceDto.dueDate},
          ${createInvoiceDto.description}, ${createInvoiceDto.grossAmount},
          ${createInvoiceDto.taxAmount || 0}, ${createInvoiceDto.netAmount},
          ${createInvoiceDto.currency || 'NGN'}, 'received',
          ${createInvoiceDto.createdBy}::uuid
        ) RETURNING *
      `;
            for (const line of createInvoiceDto.lines) {
                await this.prisma.$executeRaw `
          INSERT INTO payment.invoice_lines (
            tenant_id, invoice_id, budget_line_id, line_number,
            description, quantity, unit_price, amount, tax_rate, tax_amount
          ) VALUES (
            ${tenantId}::uuid, ${invoice.id}::uuid, ${line.budgetLineId}::uuid,
            ${line.lineNumber}, ${line.description}, ${line.quantity || 1},
            ${line.unitPrice}, ${line.amount}, ${line.taxRate || 0}, ${line.taxAmount || 0}
          )
        `;
            }
            await this.paymentQueue.add('classify-invoice', {
                tenantId,
                invoiceId: invoice.id,
                invoiceData: createInvoiceDto,
            });
            await this.glQueue.add('post-invoice', {
                tenantId,
                invoiceId: invoice.id,
            });
            this.eventEmitter.emit('invoice.created', {
                tenantId,
                invoice,
                vendor,
            });
            this.logger.log(`Invoice created: ${invoice.invoice_number}`);
            return invoice;
        }
        catch (error) {
            this.logger.error('Error creating invoice', error);
            throw error;
        }
    }
    async createPaymentVoucher(tenantId, createPvDto) {
        try {
            let invoice = null;
            if (createPvDto.invoiceId) {
                [invoice] = await this.prisma.$queryRaw `
          SELECT * FROM payment.invoices 
          WHERE id = ${createPvDto.invoiceId}::uuid 
          AND tenant_id = ${tenantId}::uuid
          AND status IN ('verified', 'approved')
        `;
                if (!invoice) {
                    throw new common_1.NotFoundException('Invoice not found or not in approved status');
                }
            }
            const pvNumber = createPvDto.pvNumber || await this.generatePvNumber(tenantId);
            for (const line of createPvDto.lines) {
                const availability = await this.checkBudgetAvailability(tenantId, line.budgetLineId, line.amount);
                if (!availability.available) {
                    throw new common_1.BadRequestException(`Insufficient budget for line ${line.lineNumber}. Available: ₦${availability.availableAmount}`);
                }
            }
            const [pv] = await this.prisma.$queryRaw `
        INSERT INTO payment.payment_vouchers (
          tenant_id, pv_number, invoice_id, vendor_id, organization_id,
          pv_date, description, gross_amount, deductions_amount, net_amount,
          currency, status, payment_mode, bank_details, created_by
        ) VALUES (
          ${tenantId}::uuid, ${pvNumber}, ${createPvDto.invoiceId || null}::uuid,
          ${createPvDto.vendorId}::uuid, ${createPvDto.organizationId}::uuid,
          ${createPvDto.pvDate}, ${createPvDto.description},
          ${createPvDto.grossAmount}, ${createPvDto.deductionsAmount || 0},
          ${createPvDto.netAmount}, ${createPvDto.currency || 'NGN'},
          'draft', ${createPvDto.paymentMode}, ${JSON.stringify(createPvDto.bankDetails || {})},
          ${createPvDto.createdBy}::uuid
        ) RETURNING *
      `;
            for (const line of createPvDto.lines) {
                await this.prisma.$executeRaw `
          INSERT INTO payment.pv_lines (
            tenant_id, pv_id, budget_line_id, line_number, description,
            amount, deduction_type, deduction_amount, net_amount
          ) VALUES (
            ${tenantId}::uuid, ${pv.id}::uuid, ${line.budgetLineId}::uuid,
            ${line.lineNumber}, ${line.description}, ${line.amount},
            ${line.deductionType}, ${line.deductionAmount || 0}, ${line.netAmount}
          )
        `;
                await this.createBudgetCommitment(tenantId, line.budgetLineId, line.amount, {
                    referenceType: 'payment_voucher',
                    referenceId: pv.id,
                    description: `PV: ${pvNumber} - ${line.description}`,
                });
            }
            await this.initiateApprovalWorkflow(tenantId, 'payment_voucher', pv.id, {
                amount: createPvDto.netAmount,
                organizationId: createPvDto.organizationId,
                vendorId: createPvDto.vendorId,
            });
            this.logger.log(`Payment voucher created: ${pvNumber}`);
            return pv;
        }
        catch (error) {
            this.logger.error('Error creating payment voucher', error);
            throw error;
        }
    }
    async processPayment(tenantId, pvId, processPaymentDto) {
        try {
            const [pv] = await this.prisma.$queryRaw `
        SELECT * FROM payment.payment_vouchers 
        WHERE id = ${pvId}::uuid 
        AND tenant_id = ${tenantId}::uuid
        AND status = 'approved'
      `;
            if (!pv) {
                throw new common_1.NotFoundException('Approved payment voucher not found');
            }
            const warrantNumber = await this.generateWarrantNumber(tenantId);
            const [warrant] = await this.prisma.$queryRaw `
        INSERT INTO payment.warrants (
          tenant_id, warrant_number, pv_id, warrant_date, amount,
          currency, bank_account, status, issued_by
        ) VALUES (
          ${tenantId}::uuid, ${warrantNumber}, ${pvId}::uuid,
          ${processPaymentDto.paymentDate}, ${pv.net_amount},
          ${pv.currency}, ${processPaymentDto.bankAccount},
          'issued', ${processPaymentDto.processedBy}::uuid
        ) RETURNING *
      `;
            const paymentReference = await this.generatePaymentReference(tenantId);
            const [payment] = await this.prisma.$queryRaw `
        INSERT INTO payment.payments (
          tenant_id, payment_reference, warrant_id, pv_id, vendor_id,
          payment_date, amount, currency, payment_method, bank_reference,
          status, processed_by
        ) VALUES (
          ${tenantId}::uuid, ${paymentReference}, ${warrant.id}::uuid,
          ${pvId}::uuid, ${pv.vendor_id}::uuid, ${processPaymentDto.paymentDate},
          ${pv.net_amount}, ${pv.currency}, ${pv.payment_mode},
          ${processPaymentDto.bankReference}, 'completed', ${processPaymentDto.processedBy}::uuid
        ) RETURNING *
      `;
            await this.prisma.$executeRaw `
        UPDATE payment.payment_vouchers
        SET status = 'paid', updated_at = NOW()
        WHERE id = ${pvId}::uuid
      `;
            await this.glQueue.add('post-payment', {
                tenantId,
                paymentId: payment.id,
            });
            await this.processPaymentObligations(tenantId, pvId);
            this.eventEmitter.emit('payment.processed', {
                tenantId,
                payment,
                warrant,
                pv,
            });
            this.logger.log(`Payment processed: ${paymentReference}`);
            return { payment, warrant };
        }
        catch (error) {
            this.logger.error('Error processing payment', error);
            throw error;
        }
    }
    async getPaymentStatus(tenantId, paymentId) {
        const [payment] = await this.prisma.$queryRaw `
      SELECT 
        p.*,
        pv.pv_number,
        pv.description as pv_description,
        w.warrant_number,
        v.name as vendor_name,
        v.vendor_code,
        o.name as organization_name
      FROM payment.payments p
      JOIN payment.payment_vouchers pv ON p.pv_id = pv.id
      JOIN payment.warrants w ON p.warrant_id = w.id
      JOIN payment.vendors v ON p.vendor_id = v.id
      JOIN budget.organizations o ON pv.organization_id = o.id
      WHERE p.id = ${paymentId}::uuid
      AND p.tenant_id = ${tenantId}::uuid
    `;
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async getVendorPayments(tenantId, vendorId, limit = 50, offset = 0) {
        return this.prisma.$queryRaw `
      SELECT 
        p.*,
        pv.pv_number,
        pv.description,
        pv.gross_amount,
        pv.net_amount,
        w.warrant_number
      FROM payment.payments p
      JOIN payment.payment_vouchers pv ON p.pv_id = pv.id
      JOIN payment.warrants w ON p.warrant_id = w.id
      WHERE p.tenant_id = ${tenantId}::uuid
      AND p.vendor_id = ${vendorId}::uuid
      ORDER BY p.payment_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    }
    async handleWorkflowCompleted(event) {
        if (event.workflowInstance.entity_type === 'payment_voucher') {
            const pvId = event.workflowInstance.entity_id;
            const status = event.status === 'approved' ? 'approved' : 'rejected';
            await this.prisma.$executeRaw `
        UPDATE payment.payment_vouchers
        SET status = ${status},
            approved_at = ${status === 'approved' ? 'NOW()' : null},
            updated_at = NOW()
        WHERE id = ${pvId}::uuid
        AND tenant_id = ${event.tenantId}::uuid
      `;
            if (status === 'rejected') {
                await this.releaseBudgetCommitments(event.tenantId, pvId);
            }
            this.logger.log(`PV ${pvId} ${status} via workflow`);
        }
    }
    async checkBudgetAvailability(tenantId, budgetLineId, amount) {
        const [result] = await this.prisma.$queryRaw `
      SELECT * FROM budget.check_budget_availability(
        ${tenantId}::uuid,
        ${budgetLineId}::uuid,
        ${amount}::decimal
      )
    `;
        return {
            available: result.available,
            approvedAmount: parseFloat(result.approved_amount),
            allottedAmount: parseFloat(result.allotted_amount),
            committedAmount: parseFloat(result.committed_amount),
            obligatedAmount: parseFloat(result.obligated_amount),
            availableAmount: parseFloat(result.available_amount),
        };
    }
    async createBudgetCommitment(tenantId, budgetLineId, amount, reference) {
        await this.prisma.$executeRaw `
      INSERT INTO budget.commitments (
        tenant_id, budget_line_id, amount, commitment_date,
        reference_number, description, status, created_by
      ) VALUES (
        ${tenantId}::uuid, ${budgetLineId}::uuid, ${amount}::decimal,
        CURRENT_DATE, ${reference.referenceId}, ${reference.description},
        'active', ${reference.createdBy || null}::uuid
      )
    `;
    }
    async initiateApprovalWorkflow(tenantId, entityType, entityId, entityData) {
        this.eventEmitter.emit('workflow.initiate', {
            tenantId,
            entityType,
            entityId,
            entityData,
        });
    }
    async processPaymentObligations(tenantId, pvId) {
        const pvLines = await this.prisma.$queryRaw `
      SELECT * FROM payment.pv_lines
      WHERE pv_id = ${pvId}::uuid
      AND tenant_id = ${tenantId}::uuid
    `;
        for (const line of pvLines) {
            await this.prisma.$executeRaw `
        UPDATE budget.commitments
        SET status = 'liquidated', updated_at = NOW()
        WHERE budget_line_id = ${line.budget_line_id}::uuid
        AND tenant_id = ${tenantId}::uuid
        AND amount = ${line.amount}::decimal
        AND status = 'active'
      `;
        }
    }
    async releaseBudgetCommitments(tenantId, pvId) {
        await this.prisma.$executeRaw `
      UPDATE budget.commitments
      SET status = 'cancelled', updated_at = NOW()
      WHERE tenant_id = ${tenantId}::uuid
      AND reference_number = ${pvId}
      AND status = 'active'
    `;
    }
    async generatePvNumber(tenantId) {
        const year = new Date().getFullYear();
        const [result] = await this.prisma.$queryRaw `
      SELECT COUNT(*) + 1 as next_number
      FROM payment.payment_vouchers
      WHERE tenant_id = ${tenantId}::uuid
      AND EXTRACT(year FROM created_at) = ${year}
    `;
        return `PV/${year}/${String(result.next_number).padStart(6, '0')}`;
    }
    async generateWarrantNumber(tenantId) {
        const year = new Date().getFullYear();
        const [result] = await this.prisma.$queryRaw `
      SELECT COUNT(*) + 1 as next_number
      FROM payment.warrants
      WHERE tenant_id = ${tenantId}::uuid
      AND EXTRACT(year FROM created_at) = ${year}
    `;
        return `WRT/${year}/${String(result.next_number).padStart(6, '0')}`;
    }
    async generatePaymentReference(tenantId) {
        const year = new Date().getFullYear();
        const [result] = await this.prisma.$queryRaw `
      SELECT COUNT(*) + 1 as next_number
      FROM payment.payments
      WHERE tenant_id = ${tenantId}::uuid
      AND EXTRACT(year FROM created_at) = ${year}
    `;
        return `PAY/${year}/${String(result.next_number).padStart(6, '0')}`;
    }
};
exports.PaymentsService = PaymentsService;
__decorate([
    (0, event_emitter_1.OnEvent)('workflow.completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsService.prototype, "handleWorkflowCompleted", null);
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)('payment-processing')),
    __param(3, (0, bull_1.InjectQueue)('gl-posting')),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, event_emitter_1.EventEmitter2, Object, Object])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map