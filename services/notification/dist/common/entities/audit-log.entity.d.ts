export declare class AuditLog {
    id: string;
    tenant_id: string;
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values: any;
    new_values: any;
    timestamp: Date;
}
