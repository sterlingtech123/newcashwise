import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    findAll(isActive?: boolean): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    findByCode(code: string): Promise<Tenant>;
    getTenantStats(id: string): Promise<any>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
    remove(id: string): Promise<void>;
    setContext(id: string, userId?: string): Promise<{
        message: string;
    }>;
    handleGetTenant(data: {
        id: string;
    }): Promise<Tenant>;
    handleValidateTenant(data: {
        id: string;
    }): Promise<{
        valid: any;
        tenant: Tenant;
        error?: undefined;
    } | {
        valid: boolean;
        error: any;
        tenant?: undefined;
    }>;
    handleSetContext(data: {
        tenantId: string;
        userId?: string;
    }): Promise<{
        success: boolean;
    }>;
}
