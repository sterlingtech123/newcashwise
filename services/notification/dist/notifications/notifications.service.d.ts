import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification } from './entities/notification.entity';
import { NotificationDelivery } from './entities/notification-delivery.entity';
import { CreateNotificationDto, BulkNotificationDto } from './dto/create-notification.dto';
import { TenantService } from '../common/services/tenant.service';
import { AuditService } from '../common/services/audit.service';
export declare class NotificationsService {
    private notificationRepository;
    private deliveryRepository;
    private notificationQueue;
    private eventEmitter;
    private tenantService;
    private auditService;
    constructor(notificationRepository: Repository<Notification>, deliveryRepository: Repository<NotificationDelivery>, notificationQueue: Queue, eventEmitter: EventEmitter2, tenantService: TenantService, auditService: AuditService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<Notification[]>;
    findAll(page?: number, limit?: number, filters?: {
        recipient_id?: string;
        type?: string;
        status?: string;
        category?: string;
        priority?: string;
        date_from?: string;
        date_to?: string;
    }): Promise<{
        data: Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markMultipleAsRead(ids: string[]): Promise<void>;
    cancel(id: string): Promise<Notification>;
    retry(id: string): Promise<Notification>;
    getUnreadCount(recipientId?: string): Promise<number>;
    getDeliveryStats(startDate: Date, endDate: Date): Promise<{
        total_sent: number;
        total_delivered: number;
        total_failed: number;
        delivery_rate: number;
        by_channel: Record<string, any>;
        by_category: Record<string, any>;
    }>;
    private scheduleDelivery;
    private calculateDelay;
    private getPriorityWeight;
    private removeFromQueue;
}
