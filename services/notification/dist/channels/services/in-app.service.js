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
var InAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppService = void 0;
const common_1 = require("@nestjs/common");
let InAppService = InAppService_1 = class InAppService {
    constructor() {
        this.logger = new common_1.Logger(InAppService_1.name);
    }
    async send(notification, delivery) {
        try {
            this.logger.log(`In-app notification prepared for user ${delivery.destination}`);
            delivery.external_id = `in_app_${notification.id}`;
            delivery.response_data = {
                status: 'stored',
                recipientId: delivery.destination,
                notificationId: notification.id,
                timestamp: new Date().toISOString(),
            };
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to prepare in-app notification: ${error.message}`);
            delivery.failure_reason = error.message;
            delivery.response_data = { error: error.message };
            return false;
        }
    }
    formatForDisplay(notification) {
        return {
            id: notification.id,
            type: notification.type,
            category: notification.category,
            priority: notification.priority,
            subject: notification.subject,
            content: notification.content,
            data: notification.data,
            isRead: notification.isRead(),
            isExpired: notification.isExpired(),
            createdAt: notification.created_at,
            expiresAt: notification.expires_at,
            metadata: {
                sourceEntityId: notification.source_entity_id,
                sourceEntityType: notification.source_entity_type,
                ...notification.metadata,
            },
        };
    }
    getDisplayIcon(category) {
        const icons = {
            payment: 'payment',
            budget: 'trending-up',
            workflow: 'clipboard',
            system: 'settings',
            security: 'shield',
            default: 'bell',
        };
        return icons[category] || icons.default;
    }
    getDisplayColor(priority) {
        const colors = {
            urgent: 'red',
            high: 'orange',
            medium: 'blue',
            low: 'green',
        };
        return colors[priority] || colors.medium;
    }
    generateWebSocketPayload(notification) {
        return {
            type: 'notification',
            action: 'new',
            data: this.formatForDisplay(notification),
            timestamp: new Date().toISOString(),
        };
    }
};
exports.InAppService = InAppService;
exports.InAppService = InAppService = InAppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InAppService);
//# sourceMappingURL=in-app.service.js.map