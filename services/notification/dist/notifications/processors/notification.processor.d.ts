import { Repository } from 'typeorm';
import { Job } from 'bull';
import { Notification } from '../entities/notification.entity';
import { NotificationDelivery } from '../entities/notification-delivery.entity';
import { EmailService } from '../../channels/services/email.service';
import { SmsService } from '../../channels/services/sms.service';
import { PushService } from '../../channels/services/push.service';
import { InAppService } from '../../channels/services/in-app.service';
export declare class NotificationProcessor {
    private notificationRepository;
    private deliveryRepository;
    private emailService;
    private smsService;
    private pushService;
    private inAppService;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, deliveryRepository: Repository<NotificationDelivery>, emailService: EmailService, smsService: SmsService, pushService: PushService, inAppService: InAppService);
    handleNotificationDelivery(job: Job<{
        notificationId: string;
    }>): Promise<void>;
    private createDeliveryRecord;
    private getDestination;
    private markAsDelivered;
    private markAsFailed;
    private markAsExpired;
}
