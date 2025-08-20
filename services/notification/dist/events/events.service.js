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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const tenant_service_1 = require("../common/services/tenant.service");
let EventsService = class EventsService {
    constructor(eventEmitter, tenantService) {
        this.eventEmitter = eventEmitter;
        this.tenantService = tenantService;
    }
    async triggerNotificationEvent(eventType, data) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        this.eventEmitter.emit('notification.trigger', {
            eventType,
            data,
            tenantId,
            userId,
            timestamp: new Date(),
        });
        return { success: true, eventType, timestamp: new Date() };
    }
    async simulateEvent(eventType, data) {
        return this.triggerNotificationEvent(eventType, data);
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_emitter_1.EventEmitter2,
        tenant_service_1.TenantService])
], EventsService);
//# sourceMappingURL=events.service.js.map