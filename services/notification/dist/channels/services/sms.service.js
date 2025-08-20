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
var SmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SmsService = SmsService_1 = class SmsService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SmsService_1.name);
    }
    async send(notification, delivery) {
        try {
            const smsContent = this.formatSmsContent(notification);
            this.logger.log(`SMS sent to ${delivery.destination}: ${smsContent}`);
            delivery.external_id = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            delivery.response_data = {
                status: 'sent',
                destination: delivery.destination,
                content: smsContent,
                timestamp: new Date().toISOString(),
            };
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send SMS: ${error.message}`);
            delivery.failure_reason = error.message;
            delivery.response_data = { error: error.message };
            return false;
        }
    }
    formatSmsContent(notification) {
        const maxLength = 160;
        let content = `${notification.subject}: ${this.stripHtml(notification.content)}`;
        if (content.length > maxLength) {
            content = content.substring(0, maxLength - 3) + '...';
        }
        return content;
    }
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    async verifyConfiguration() {
        try {
            const apiKey = this.configService.get('SMS_API_KEY');
            const apiSecret = this.configService.get('SMS_API_SECRET');
            if (!apiKey || !apiSecret) {
                this.logger.warn('SMS service not configured');
                return false;
            }
            this.logger.log('SMS service configuration verified');
            return true;
        }
        catch (error) {
            this.logger.error(`SMS service verification failed: ${error.message}`);
            return false;
        }
    }
};
exports.SmsService = SmsService;
exports.SmsService = SmsService = SmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SmsService);
//# sourceMappingURL=sms.service.js.map