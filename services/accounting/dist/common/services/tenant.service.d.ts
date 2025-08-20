import { Request } from 'express';
export declare class TenantService {
    private request;
    constructor(request: Request);
    getCurrentTenantId(): string;
    getCurrentUserId(): string;
}
