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
var EventListenerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListenerService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const notifications_service_1 = require("../../notifications/notifications.service");
let EventListenerService = EventListenerService_1 = class EventListenerService {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
        this.logger = new common_1.Logger(EventListenerService_1.name);
    }
    async handleNotificationTrigger(payload) {
        this.logger.log(`Handling notification trigger: ${payload.eventType}`);
        try {
            switch (payload.eventType) {
                case 'payment.approved':
                    await this.handlePaymentApproved(payload);
                    break;
                case 'payment.rejected':
                    await this.handlePaymentRejected(payload);
                    break;
                case 'budget.threshold_exceeded':
                    await this.handleBudgetThresholdExceeded(payload);
                    break;
                case 'workflow.task_assigned':
                    await this.handleWorkflowTaskAssigned(payload);
                    break;
                case 'system.maintenance':
                    await this.handleSystemMaintenance(payload);
                    break;
                default:
                    this.logger.warn(`Unhandled event type: ${payload.eventType}`);
            }
        }
        catch (error) {
            this.logger.error(`Error handling notification trigger: ${error.message}`);
        }
    }
    async handlePaymentApproved(payload) {
        const { data } = payload;
        await this.notificationsService.create({
            recipient_id: data.created_by,
            type: 'email',
            category: 'payment',
            priority: 'medium',
            subject: `Payment Approved - ${data.reference_number}`,
            content: `Your payment voucher ${data.reference_number} for ${data.amount} has been approved.`,
            data: {
                payment_id: data.id,
                reference_number: data.reference_number,
                amount: data.amount,
                beneficiary: data.beneficiary_name,
            },
        });
    }
    async handlePaymentRejected(payload) {
        const { data } = payload;
        await this.notificationsService.create({
            recipient_id: data.created_by,
            type: 'email',
            category: 'payment',
            priority: 'high',
            subject: `Payment Rejected - ${data.reference_number}`,
            content: `Your payment voucher ${data.reference_number} has been rejected. Reason: ${data.rejection_reason}`,
            data: {
                payment_id: data.id,
                reference_number: data.reference_number,
                amount: data.amount,
                rejection_reason: data.rejection_reason,
            },
        });
    }
    async handleBudgetThresholdExceeded(payload) {
        const { data } = payload;
        await this.notificationsService.create({
            recipient_id: data.budget_officer_id,
            type: 'email',
            category: 'budget',
            priority: 'high',
            subject: `Budget Alert - ${data.budget_line_name}`,
            content: `Budget line ${data.budget_line_name} has exceeded ${data.threshold}% utilization.`,
            data: {
                budget_line_id: data.budget_line_id,
                budget_line_name: data.budget_line_name,
                threshold: data.threshold,
                utilization: data.current_utilization,
            },
        });
    }
    async handleWorkflowTaskAssigned(payload) {
        const { data } = payload;
        await this.notificationsService.create({
            recipient_id: data.assigned_to,
            type: 'in_app',
            category: 'workflow',
            priority: 'medium',
            subject: `New Task Assigned - ${data.task_title}`,
            content: `A new workflow task has been assigned to you: ${data.task_title}`,
            data: {
                task_id: data.task_id,
                workflow_id: data.workflow_id,
                entity_type: data.entity_type,
                entity_id: data.entity_id,
            },
        });
    }
    async handleSystemMaintenance(payload) {
        const { data } = payload;
        await this.notificationsService.createBulk({
            recipient_ids: data.user_ids,
            type: 'in_app',
            category: 'system',
            priority: 'medium',
            subject: 'System Maintenance Notice',
            content: `System maintenance is scheduled for ${data.maintenance_date} from ${data.start_time} to ${data.end_time}.`,
            data: {
                maintenance_date: data.maintenance_date,
                start_time: data.start_time,
                end_time: data.end_time,
            },
        });
    }
};
exports.EventListenerService = EventListenerService;
__decorate([
    (0, event_emitter_1.OnEvent)('notification.trigger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventListenerService.prototype, "handleNotificationTrigger", null);
exports.EventListenerService = EventListenerService = EventListenerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], EventListenerService);
//# sourceMappingURL=event-listener.service.js.map