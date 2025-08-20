import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class TenantsService {
    private prisma;
    private eventEmitter;
    private readonly logger;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    findAll(isActive?: boolean): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    findByCode(code: string): Promise<Tenant>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
    remove(id: string): Promise<void>;
    setTenantContext(tenantId: string, userId?: string): Promise<void>;
    getTenantStats(tenantId: string): Promise<any>;
    private createDefaultRoles;
    private createDefaultChartOfAccounts;
}
