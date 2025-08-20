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
var NotificationProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const notification_delivery_entity_1 = require("../entities/notification-delivery.entity");
const email_service_1 = require("../../channels/services/email.service");
const sms_service_1 = require("../../channels/services/sms.service");
const push_service_1 = require("../../channels/services/push.service");
const in_app_service_1 = require("../../channels/services/in-app.service");
let NotificationProcessor = NotificationProcessor_1 = class NotificationProcessor {
    constructor(notificationRepository, deliveryRepository, emailService, smsService, pushService, inAppService) {
        this.notificationRepository = notificationRepository;
        this.deliveryRepository = deliveryRepository;
        this.emailService = emailService;
        this.smsService = smsService;
        this.pushService = pushService;
        this.inAppService = inAppService;
        this.logger = new common_1.Logger(NotificationProcessor_1.name);
    }
    async handleNotificationDelivery(job) {
        const { notificationId } = job.data;
        this.logger.log(`Processing notification delivery: ${notificationId}`);
        try {
            const notification = await this.notificationRepository.findOne({
                where: { id: notificationId },
                relations: ['template'],
            });
            if (!notification) {
                this.logger.error(`Notification ${notificationId} not found`);
                return;
            }
            if (notification.status !== 'pending') {
                this.logger.warn(`Notification ${notificationId} is not pending (status: ${notification.status})`);
                return;
            }
            if (notification.isExpired()) {
                await this.markAsExpired(notification);
                return;
            }
            const delivery = await this.createDeliveryRecord(notification);
            let success = false;
            let failureReason = '';
            try {
                switch (notification.type) {
                    case 'email':
                        success = await this.emailService.send(notification, delivery);
                        break;
                    case 'sms':
                        success = await this.smsService.send(notification, delivery);
                        break;
                    case 'push':
                        success = await this.pushService.send(notification, delivery);
                        break;
                    case 'in_app':
                        success = await this.inAppService.send(notification, delivery);
                        break;
                    default:
                        throw new Error(`Unsupported notification type: ${notification.type}`);
                }
                if (success) {
                    await this.markAsDelivered(notification, delivery);
                    this.logger.log(`Notification ${notificationId} delivered successfully`);
                }
                else {
                    throw new Error('Delivery failed without specific error');
                }
            }
            catch (error) {
                failureReason = error.message;
                await this.markAsFailed(notification, delivery, failureReason);
                if (notification.canRetry()) {
                    throw error;
                }
                else {
                    this.logger.error(`Notification ${notificationId} failed permanently: ${failureReason}`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Error processing notification ${notificationId}:`, error);
            throw error;
        }
    }
    async createDeliveryRecord(notification) {
        const destination = await this.getDestination(notification);
        const delivery = this.deliveryRepository.create({
            tenant_id: notification.tenant_id,
            notification_id: notification.id,
            channel: notification.type,
            destination,
            status: 'pending',
            created_by: notification.created_by,
        });
        return this.deliveryRepository.save(delivery);
    }
    async getDestination(notification) {
        switch (notification.type) {
            case 'email':
                return `user-${notification.recipient_id}@example.com`;
            case 'sms':
                return `+234${Math.floor(Math.random() * 1000000000)}`;
            case 'push':
                return `device-token-${notification.recipient_id}`;
            case 'in_app':
                return notification.recipient_id;
            default:
                return notification.recipient_id;
        }
    }
    async markAsDelivered(notification, delivery) {
        const now = new Date();
        await this.notificationRepository.update(notification.id, {
            status: 'sent',
            sent_at: now,
        });
        await this.deliveryRepository.update(delivery.id, {
            status: 'sent',
            sent_at: now,
            delivered_at: now,
        });
    }
    async markAsFailed(notification, delivery, failureReason) {
        await this.notificationRepository.update(notification.id, {
            status: 'failed',
            failure_reason: failureReason,
            retry_count: notification.retry_count + 1,
        });
        await this.deliveryRepository.update(delivery.id, {
            status: 'failed',
            failure_reason: failureReason,
            retry_count: delivery.retry_count + 1,
        });
    }
    async markAsExpired(notification) {
        await this.notificationRepository.update(notification.id, {
            status: 'expired',
        });
        this.logger.warn(`Notification ${notification.id} has expired`);
    }
};
exports.NotificationProcessor = NotificationProcessor;
__decorate([
    (0, bull_1.Process)('deliver-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationProcessor.prototype, "handleNotificationDelivery", null);
exports.NotificationProcessor = NotificationProcessor = NotificationProcessor_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, bull_1.Processor)('notification'),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_delivery_entity_1.NotificationDelivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService,
        sms_service_1.SmsService,
        push_service_1.PushService,
        in_app_service_1.InAppService])
], NotificationProcessor);
//# sourceMappingURL=notification.processor.js.map