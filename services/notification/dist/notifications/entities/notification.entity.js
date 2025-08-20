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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
const notification_delivery_entity_1 = require("./notification-delivery.entity");
const notification_template_entity_1 = require("../../templates/entities/notification-template.entity");
let Notification = class Notification extends base_entity_1.BaseEntity {
    isRead() {
        return this.read_at !== null;
    }
    isExpired() {
        return this.expires_at && new Date() > this.expires_at;
    }
    canRetry() {
        return this.retry_count < this.max_retries && this.status === 'failed';
    }
    getDeliveryChannel() {
        return this.type;
    }
    isHighPriority() {
        return ['high', 'urgent'].includes(this.priority);
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "recipient_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notification.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'pending' }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "scheduled_for", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sent_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "read_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamptz', { nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "template_id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "source_entity_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "source_entity_type", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "failure_reason", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Notification.prototype, "retry_count", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 3 }),
    __metadata("design:type", Number)
], Notification.prototype, "max_retries", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => notification_template_entity_1.NotificationTemplate, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'template_id' }),
    __metadata("design:type", notification_template_entity_1.NotificationTemplate)
], Notification.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_delivery_entity_1.NotificationDelivery, delivery => delivery.notification, { cascade: true }),
    __metadata("design:type", Array)
], Notification.prototype, "deliveries", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications', { schema: 'notification' }),
    (0, typeorm_1.Index)(['tenant_id', 'recipient_id']),
    (0, typeorm_1.Index)(['tenant_id', 'status']),
    (0, typeorm_1.Index)(['tenant_id', 'type']),
    (0, typeorm_1.Index)(['tenant_id', 'priority']),
    (0, typeorm_1.Index)(['tenant_id', 'scheduled_for'])
], Notification);
//# sourceMappingURL=notification.entity.js.map