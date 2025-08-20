import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, BulkNotificationDto } from './dto/create-notification.dto';
import { Notification } from './entities/notification.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    create(createNotificationDto: CreateNotificationDto): Promise<Notification>;
    createBulk(bulkNotificationDto: BulkNotificationDto): Promise<Notification[]>;
    findAll(page?: number, limit?: number, recipient_id?: string, type?: string, status?: string, category?: string, priority?: string, date_from?: string, date_to?: string): Promise<{
        data: Notification[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreadCount(recipient_id?: string): Promise<{
        count: number;
    }>;
    getDeliveryStats(startDate: string, endDate: string): Promise<{
        total_sent: number;
        total_delivered: number;
        total_failed: number;
        delivery_rate: number;
        by_channel: Record<string, any>;
        by_category: Record<string, any>;
    }>;
    findOne(id: string): Promise<Notification>;
    markAsRead(id: string): Promise<Notification>;
    markMultipleAsRead(body: {
        ids: string[];
    }): Promise<{
        success: boolean;
    }>;
    cancel(id: string): Promise<Notification>;
    retry(id: string): Promise<Notification>;
}
