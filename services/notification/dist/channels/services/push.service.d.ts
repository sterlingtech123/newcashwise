import { ConfigService } from '@nestjs/config';
import { Notification } from '../../notifications/entities/notification.entity';
import { NotificationDelivery } from '../../notifications/entities/notification-delivery.entity';
export declare class PushService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    send(notification: Notification, delivery: NotificationDelivery): Promise<boolean>;
    private formatPushPayload;
    private stripHtml;
    private getPriorityColor;
    private getNotificationActions;
    verifyConfiguration(): Promise<boolean>;
}
