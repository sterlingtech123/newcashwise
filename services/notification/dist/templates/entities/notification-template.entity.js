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
exports.NotificationTemplate = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../common/entities/base.entity");
let NotificationTemplate = class NotificationTemplate extends base_entity_1.BaseEntity {
    renderSubject(data) {
        return this.renderTemplate(this.subject_template, data);
    }
    renderContent(data) {
        return this.renderTemplate(this.content_template, data);
    }
    renderTemplate(template, data) {
        let rendered = template;
        Object.keys(data || {}).forEach(key => {
            const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            rendered = rendered.replace(placeholder, data[key] || '');
        });
        if (this.default_data) {
            Object.keys(this.default_data).forEach(key => {
                const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                rendered = rendered.replace(placeholder, this.default_data[key] || '');
            });
        }
        return rendered;
    }
    getVariableList() {
        return this.variables || [];
    }
    validateData(data) {
        const requiredVariables = this.getVariableList();
        const providedVariables = Object.keys(data || {});
        const defaultVariables = Object.keys(this.default_data || {});
        const missingVariables = requiredVariables.filter(variable => !providedVariables.includes(variable) && !defaultVariables.includes(variable));
        return {
            valid: missingVariables.length === 0,
            missingVariables,
        };
    }
};
exports.NotificationTemplate = NotificationTemplate;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "subject_template", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], NotificationTemplate.prototype, "content_template", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Array)
], NotificationTemplate.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], NotificationTemplate.prototype, "default_data", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], NotificationTemplate.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], NotificationTemplate.prototype, "is_system", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], NotificationTemplate.prototype, "styling", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], NotificationTemplate.prototype, "metadata", void 0);
exports.NotificationTemplate = NotificationTemplate = __decorate([
    (0, typeorm_1.Entity)('notification_templates', { schema: 'notification' }),
    (0, typeorm_1.Index)(['tenant_id', 'name']),
    (0, typeorm_1.Index)(['tenant_id', 'category']),
    (0, typeorm_1.Index)(['tenant_id', 'channel']),
    (0, typeorm_1.Index)(['tenant_id', 'is_active'])
], NotificationTemplate);
//# sourceMappingURL=notification-template.entity.js.map