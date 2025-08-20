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
exports.NotificationDelivery = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const notification_entity_1 = require("./notification.entity");
let NotificationDelivery = class NotificationDelivery extends base_entity_1.BaseEntity {
    isDelivered() {
        return ['sent', 'delivered'].includes(this.status);
    }
    isFailed() {
        return ['failed', 'bounced'].includes(this.status);
    }
    wasOpened() {
        return this.opened_at !== null;
    }
    wasClicked() {
        return this.clicked_at !== null;
    }
    getDeliveryTime() {
        if (!this.sent_at || !this.delivered_at)
            return null;
        return this.delivered_at.getTime() - this.sent_at.getTime();
    }
};
exports.NotificationDelivery = NotificationDelivery;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "notification_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "destination", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], NotificationDelivery.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], NotificationDelivery.prototype, "delivered_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], NotificationDelivery.prototype, "opened_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], NotificationDelivery.prototype, "clicked_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "external_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], NotificationDelivery.prototype, "failure_reason", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], NotificationDelivery.prototype, "response_data", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], NotificationDelivery.prototype, "retry_count", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], NotificationDelivery.prototype, "delivery_metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => notification_entity_1.Notification, notification => notification.deliveries, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_id' }),
    __metadata("design:type", notification_entity_1.Notification)
], NotificationDelivery.prototype, "notification", void 0);
exports.NotificationDelivery = NotificationDelivery = __decorate([
    (0, typeorm_1.Entity)('notification_deliveries', { schema: 'notification' }),
    (0, typeorm_1.Index)(['tenant_id', 'notification_id']),
    (0, typeorm_1.Index)(['tenant_id', 'channel']),
    (0, typeorm_1.Index)(['tenant_id', 'status']),
    (0, typeorm_1.Index)(['tenant_id', 'delivered_at'])
], NotificationDelivery);
//# sourceMappingURL=notification-delivery.entity.js.map