import { Notification } from '../../notifications/entities/notification.entity';
import { NotificationDelivery } from '../../notifications/entities/notification-delivery.entity';
export declare class InAppService {
    private readonly logger;
    constructor();
    send(notification: Notification, delivery: NotificationDelivery): Promise<boolean>;
    formatForDisplay(notification: Notification): any;
    getDisplayIcon(category: string): string;
    getDisplayColor(priority: string): string;
    generateWebSocketPayload(notification: Notification): any;
}
