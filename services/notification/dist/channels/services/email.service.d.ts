import { ConfigService } from '@nestjs/config';
import { Notification } from '../../notifications/entities/notification.entity';
import { NotificationDelivery } from '../../notifications/entities/notification-delivery.entity';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private initializeTransporter;
    send(notification: Notification, delivery: NotificationDelivery): Promise<boolean>;
    private formatEmailContent;
    private stripHtml;
    verifyConnection(): Promise<boolean>;
}
