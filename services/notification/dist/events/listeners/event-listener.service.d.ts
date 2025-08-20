import { NotificationsService } from '../../notifications/notifications.service';
export declare class EventListenerService {
    private notificationsService;
    private readonly logger;
    constructor(notificationsService: NotificationsService);
    handleNotificationTrigger(payload: any): Promise<void>;
    private handlePaymentApproved;
    private handlePaymentRejected;
    private handleBudgetThresholdExceeded;
    private handleWorkflowTaskAssigned;
    private handleSystemMaintenance;
}
