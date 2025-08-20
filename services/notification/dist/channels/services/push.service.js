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
var PushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PushService = PushService_1 = class PushService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PushService_1.name);
    }
    async send(notification, delivery) {
        try {
            const pushPayload = this.formatPushPayload(notification);
            this.logger.log(`Push notification sent to ${delivery.destination}:`, pushPayload);
            delivery.external_id = `push_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            delivery.response_data = {
                status: 'sent',
                deviceToken: delivery.destination,
                payload: pushPayload,
                timestamp: new Date().toISOString(),
            };
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send push notification: ${error.message}`);
            delivery.failure_reason = error.message;
            delivery.response_data = { error: error.message };
            return false;
        }
    }
    formatPushPayload(notification) {
        return {
            notification: {
                title: notification.subject,
                body: this.stripHtml(notification.content).substring(0, 100),
                icon: '/assets/icons/notification-icon.png',
                badge: '/assets/icons/badge-icon.png',
                tag: notification.category,
                requireInteraction: notification.isHighPriority(),
            },
            data: {
                notificationId: notification.id,
                category: notification.category,
                priority: notification.priority,
                sourceEntityId: notification.source_entity_id,
                sourceEntityType: notification.source_entity_type,
                ...notification.data,
            },
            android: {
                priority: notification.isHighPriority() ? 'high' : 'normal',
                notification: {
                    channelId: `cashwise_${notification.category}`,
                    color: this.getPriorityColor(notification.priority),
                },
            },
            apns: {
                payload: {
                    aps: {
                        alert: {
                            title: notification.subject,
                            body: this.stripHtml(notification.content).substring(0, 100),
                        },
                        badge: 1,
                        sound: notification.isHighPriority() ? 'urgent.caf' : 'default',
                    },
                },
            },
            webpush: {
                headers: {
                    Urgency: notification.isHighPriority() ? 'high' : 'normal',
                },
                notification: {
                    title: notification.subject,
                    body: this.stripHtml(notification.content).substring(0, 100),
                    icon: '/assets/icons/notification-icon.png',
                    badge: '/assets/icons/badge-icon.png',
                    tag: notification.category,
                    requireInteraction: notification.isHighPriority(),
                    actions: this.getNotificationActions(notification),
                },
            },
        };
    }
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    getPriorityColor(priority) {
        const colors = {
            urgent: '#dc3545',
            high: '#fd7e14',
            medium: '#ffc107',
            low: '#28a745',
        };
        return colors[priority] || colors.medium;
    }
    getNotificationActions(notification) {
        const actions = [];
        switch (notification.category) {
            case 'payment':
                actions.push({ action: 'view', title: 'View Payment', icon: '/assets/icons/view.png' });
                break;
            case 'workflow':
                actions.push({ action: 'approve', title: 'Approve', icon: '/assets/icons/approve.png' }, { action: 'review', title: 'Review', icon: '/assets/icons/review.png' });
                break;
            case 'budget':
                actions.push({ action: 'view', title: 'View Budget', icon: '/assets/icons/budget.png' });
                break;
            default:
                actions.push({ action: 'view', title: 'View', icon: '/assets/icons/view.png' });
        }
        return actions;
    }
    async verifyConfiguration() {
        try {
            const fcmServerKey = this.configService.get('FCM_SERVER_KEY');
            const vapidPublicKey = this.configService.get('VAPID_PUBLIC_KEY');
            const vapidPrivateKey = this.configService.get('VAPID_PRIVATE_KEY');
            if (!fcmServerKey && (!vapidPublicKey || !vapidPrivateKey)) {
                this.logger.warn('Push notification service not configured');
                return false;
            }
            this.logger.log('Push notification service configuration verified');
            return true;
        }
        catch (error) {
            this.logger.error(`Push service verification failed: ${error.message}`);
            return false;
        }
    }
};
exports.PushService = PushService;
exports.PushService = PushService = PushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PushService);
//# sourceMappingURL=push.service.js.map