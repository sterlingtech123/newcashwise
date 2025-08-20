export declare class CreateNotificationDto {
    recipient_id: string;
    type: string;
    category: string;
    priority?: string;
    subject: string;
    content: string;
    data?: any;
    scheduled_for?: string;
    expires_at?: string;
    template_id?: string;
    source_entity_id?: string;
    source_entity_type?: string;
    max_retries?: number;
    metadata?: any;
}
export declare class BulkNotificationDto {
    recipient_ids: string[];
    type: string;
    category: string;
    subject: string;
    content: string;
    data?: any;
    priority?: string;
    template_id?: string;
}
