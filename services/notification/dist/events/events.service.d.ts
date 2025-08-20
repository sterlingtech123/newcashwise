import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantService } from '../common/services/tenant.service';
export declare class EventsService {
    private eventEmitter;
    private tenantService;
    constructor(eventEmitter: EventEmitter2, tenantService: TenantService);
    triggerNotificationEvent(eventType: string, data: any): Promise<{
        success: boolean;
        eventType: string;
        timestamp: Date;
    }>;
    simulateEvent(eventType: string, data: any): Promise<{
        success: boolean;
        eventType: string;
        timestamp: Date;
    }>;
}
