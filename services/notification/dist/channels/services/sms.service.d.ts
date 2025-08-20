import { ConfigService } from '@nestjs/config';
import { Notification } from '../../notifications/entities/notification.entity';
import { NotificationDelivery } from '../../notifications/entities/notification-delivery.entity';
export declare class SmsService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    send(notification: Notification, delivery: NotificationDelivery): Promise<boolean>;
    private formatSmsContent;
    private stripHtml;
    verifyConfiguration(): Promise<boolean>;
}
