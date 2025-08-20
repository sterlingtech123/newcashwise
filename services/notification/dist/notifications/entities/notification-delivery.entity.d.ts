import { BaseEntity } from '../../common/entities/base.entity';
import { Notification } from './notification.entity';
export declare class NotificationDelivery extends BaseEntity {
    notification_id: string;
    channel: string;
    destination: string;
    status: string;
    sent_at: Date;
    delivered_at: Date;
    opened_at: Date;
    clicked_at: Date;
    external_id: string;
    failure_reason: string;
    response_data: any;
    retry_count: number;
    delivery_metadata: any;
    notification: Notification;
    isDelivered(): boolean;
    isFailed(): boolean;
    wasOpened(): boolean;
    wasClicked(): boolean;
    getDeliveryTime(): number | null;
}
