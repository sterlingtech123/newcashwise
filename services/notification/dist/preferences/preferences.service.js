"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../common/services/tenant.service");
let PreferencesService = class PreferencesService {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async getUserPreferences(userId) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const currentUserId = this.tenantService.getCurrentUserId();
        const targetUserId = userId || currentUserId;
        return {
            userId: targetUserId,
            tenantId,
            preferences: {
                email: {
                    enabled: true,
                    categories: {
                        payment: true,
                        budget: true,
                        workflow: true,
                        system: false,
                    },
                },
                sms: {
                    enabled: false,
                    categories: {
                        payment: false,
                        budget: false,
                        workflow: false,
                        system: false,
                    },
                },
                push: {
                    enabled: true,
                    categories: {
                        payment: true,
                        budget: true,
                        workflow: true,
                        system: true,
                    },
                },
                in_app: {
                    enabled: true,
                    categories: {
                        payment: true,
                        budget: true,
                        workflow: true,
                        system: true,
                    },
                },
            },
            quietHours: {
                enabled: true,
                startTime: '22:00',
                endTime: '07:00',
                timezone: 'Africa/Lagos',
            },
        };
    }
    async updatePreferences(preferences) {
        return { success: true, preferences };
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map