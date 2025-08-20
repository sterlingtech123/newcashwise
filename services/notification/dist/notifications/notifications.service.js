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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bull_1 = require("@nestjs/bull");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("./entities/notification.entity");
const notification_delivery_entity_1 = require("./entities/notification-delivery.entity");
const tenant_service_1 = require("../common/services/tenant.service");
const audit_service_1 = require("../common/services/audit.service");
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, deliveryRepository, notificationQueue, eventEmitter, tenantService, auditService) {
        this.notificationRepository = notificationRepository;
        this.deliveryRepository = deliveryRepository;
        this.notificationQueue = notificationQueue;
        this.eventEmitter = eventEmitter;
        this.tenantService = tenantService;
        this.auditService = auditService;
    }
    async create(createNotificationDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const notification = this.notificationRepository.create({
            ...createNotificationDto,
            tenant_id: tenantId,
            scheduled_for: createNotificationDto.scheduled_for ?
                new Date(createNotificationDto.scheduled_for) : new Date(),
            expires_at: createNotificationDto.expires_at ?
                new Date(createNotificationDto.expires_at) : null,
            priority: createNotificationDto.priority || 'medium',
            status: 'pending',
            created_by: userId,
        });
        const savedNotification = await this.notificationRepository.save(notification);
        const delay = this.calculateDelay(savedNotification.scheduled_for);
        await this.scheduleDelivery(savedNotification, delay);
        await this.auditService.logAction(tenantId, userId, 'CREATE', 'Notification', savedNotification.id, null, savedNotification);
        this.eventEmitter.emit('notification.created', {
            notification: savedNotification,
            tenantId,
            userId,
        });
        return this.findOne(savedNotification.id);
    }
    async createBulk(bulkNotificationDto) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const notifications = bulkNotificationDto.recipient_ids.map(recipientId => {
            return this.notificationRepository.create({
                ...bulkNotificationDto,
                recipient_id: recipientId,
                tenant_id: tenantId,
                scheduled_for: new Date(),
                priority: bulkNotificationDto.priority || 'medium',
                status: 'pending',
                created_by: userId,
            });
        });
        const savedNotifications = await this.notificationRepository.save(notifications);
        for (const notification of savedNotifications) {
            await this.scheduleDelivery(notification, 0);
        }
        await this.auditService.logAction(tenantId, userId, 'BULK_CREATE', 'Notification', 'bulk', null, { count: savedNotifications.length, recipients: bulkNotificationDto.recipient_ids });
        return savedNotifications;
    }
    async findAll(page = 1, limit = 50, filters) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.deliveries', 'deliveries')
            .leftJoinAndSelect('notification.template', 'template')
            .where('notification.tenant_id = :tenantId', { tenantId })
            .orderBy('notification.created_at', 'DESC');
        if (filters?.recipient_id) {
            queryBuilder.andWhere('notification.recipient_id = :recipientId', {
                recipientId: filters.recipient_id
            });
        }
        if (filters?.type) {
            queryBuilder.andWhere('notification.type = :type', { type: filters.type });
        }
        if (filters?.status) {
            queryBuilder.andWhere('notification.status = :status', { status: filters.status });
        }
        if (filters?.category) {
            queryBuilder.andWhere('notification.category = :category', { category: filters.category });
        }
        if (filters?.priority) {
            queryBuilder.andWhere('notification.priority = :priority', { priority: filters.priority });
        }
        if (filters?.date_from) {
            queryBuilder.andWhere('notification.created_at >= :dateFrom', {
                dateFrom: filters.date_from
            });
        }
        if (filters?.date_to) {
            queryBuilder.andWhere('notification.created_at <= :dateTo', {
                dateTo: filters.date_to
            });
        }
        const total = await queryBuilder.getCount();
        const data = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const notification = await this.notificationRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['deliveries', 'template'],
        });
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return notification;
    }
    async markAsRead(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const notification = await this.findOne(id);
        if (notification.read_at) {
            return notification;
        }
        await this.notificationRepository.update({ id, tenant_id: tenantId }, { read_at: new Date() });
        await this.auditService.logAction(tenantId, userId, 'READ', 'Notification', id, { read_at: null }, { read_at: new Date() });
        this.eventEmitter.emit('notification.read', {
            notificationId: id,
            userId,
            tenantId,
        });
        return this.findOne(id);
    }
    async markMultipleAsRead(ids) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        await this.notificationRepository.update({ id: (0, typeorm_2.In)(ids), tenant_id: tenantId, read_at: null }, { read_at: new Date() });
        await this.auditService.logAction(tenantId, userId, 'BULK_READ', 'Notification', 'bulk', null, { ids, count: ids.length });
    }
    async cancel(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const notification = await this.findOne(id);
        if (notification.status !== 'pending') {
            throw new common_1.BadRequestException('Only pending notifications can be cancelled');
        }
        await this.notificationRepository.update({ id, tenant_id: tenantId }, { status: 'cancelled' });
        await this.removeFromQueue(id);
        await this.auditService.logAction(tenantId, userId, 'CANCEL', 'Notification', id, { status: 'pending' }, { status: 'cancelled' });
        return this.findOne(id);
    }
    async retry(id) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        const notification = await this.findOne(id);
        if (!notification.canRetry()) {
            throw new common_1.BadRequestException('Notification cannot be retried');
        }
        await this.notificationRepository.update({ id, tenant_id: tenantId }, {
            status: 'pending',
            retry_count: notification.retry_count + 1,
            failure_reason: null,
        });
        await this.scheduleDelivery(notification, 0);
        await this.auditService.logAction(tenantId, userId, 'RETRY', 'Notification', id, { status: 'failed' }, { status: 'pending', retry_count: notification.retry_count + 1 });
        return this.findOne(id);
    }
    async getUnreadCount(recipientId) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const currentUserId = this.tenantService.getCurrentUserId();
        const queryBuilder = this.notificationRepository
            .createQueryBuilder('notification')
            .where('notification.tenant_id = :tenantId', { tenantId })
            .andWhere('notification.read_at IS NULL')
            .andWhere('notification.status = :status', { status: 'sent' });
        if (recipientId) {
            queryBuilder.andWhere('notification.recipient_id = :recipientId', { recipientId });
        }
        else {
            queryBuilder.andWhere('notification.recipient_id = :recipientId', {
                recipientId: currentUserId
            });
        }
        return queryBuilder.getCount();
    }
    async getDeliveryStats(startDate, endDate) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const notifications = await this.notificationRepository.find({
            where: {
                tenant_id: tenantId,
                created_at: (0, typeorm_2.Between)(startDate, endDate),
            },
            relations: ['deliveries'],
        });
        const stats = {
            total_sent: 0,
            total_delivered: 0,
            total_failed: 0,
            delivery_rate: 0,
            by_channel: {},
            by_category: {},
        };
        notifications.forEach(notification => {
            if (!stats.by_category[notification.category]) {
                stats.by_category[notification.category] = {
                    sent: 0,
                    delivered: 0,
                    failed: 0,
                };
            }
            notification.deliveries.forEach(delivery => {
                if (delivery.status === 'sent' || delivery.status === 'delivered') {
                    stats.total_sent++;
                    stats.by_category[notification.category].sent++;
                }
                if (delivery.status === 'delivered') {
                    stats.total_delivered++;
                    stats.by_category[notification.category].delivered++;
                }
                if (delivery.isFailed()) {
                    stats.total_failed++;
                    stats.by_category[notification.category].failed++;
                }
                if (!stats.by_channel[delivery.channel]) {
                    stats.by_channel[delivery.channel] = {
                        sent: 0,
                        delivered: 0,
                        failed: 0,
                    };
                }
                if (delivery.status === 'sent' || delivery.status === 'delivered') {
                    stats.by_channel[delivery.channel].sent++;
                }
                if (delivery.status === 'delivered') {
                    stats.by_channel[delivery.channel].delivered++;
                }
                if (delivery.isFailed()) {
                    stats.by_channel[delivery.channel].failed++;
                }
            });
        });
        stats.delivery_rate = stats.total_sent > 0 ?
            (stats.total_delivered / stats.total_sent) * 100 : 0;
        return stats;
    }
    async scheduleDelivery(notification, delay) {
        const priority = this.getPriorityWeight(notification.priority);
        await this.notificationQueue.add('deliver-notification', { notificationId: notification.id }, {
            delay,
            priority,
            attempts: notification.max_retries + 1,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
            removeOnComplete: 100,
            removeOnFail: 50,
        });
    }
    calculateDelay(scheduledFor) {
        const now = new Date();
        const delay = scheduledFor.getTime() - now.getTime();
        return Math.max(0, delay);
    }
    getPriorityWeight(priority) {
        const weights = {
            urgent: 10,
            high: 7,
            medium: 5,
            low: 1,
        };
        return weights[priority] || 5;
    }
    async removeFromQueue(notificationId) {
        const jobs = await this.notificationQueue.getJobs(['waiting', 'delayed']);
        for (const job of jobs) {
            if (job.data.notificationId === notificationId) {
                await job.remove();
                break;
            }
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(notification_delivery_entity_1.NotificationDelivery)),
    __param(2, (0, bull_1.InjectQueue)('notification')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object, event_emitter_1.EventEmitter2,
        tenant_service_1.TenantService,
        audit_service_1.AuditService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map