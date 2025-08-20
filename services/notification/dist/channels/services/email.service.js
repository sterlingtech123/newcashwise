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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.initializeTransporter();
    }
    initializeTransporter() {
        const emailConfig = {
            host: this.configService.get('SMTP_HOST', 'localhost'),
            port: this.configService.get('SMTP_PORT', 587),
            secure: this.configService.get('SMTP_SECURE', false),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        };
        this.transporter = nodemailer.createTransporter(emailConfig);
    }
    async send(notification, delivery) {
        try {
            const mailOptions = {
                from: this.configService.get('SMTP_FROM', 'noreply@cashwise.gov.ng'),
                to: delivery.destination,
                subject: notification.subject,
                html: this.formatEmailContent(notification),
                text: this.stripHtml(notification.content),
            };
            const result = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully: ${result.messageId}`);
            delivery.external_id = result.messageId;
            delivery.response_data = {
                messageId: result.messageId,
                response: result.response
            };
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send email: ${error.message}`);
            delivery.failure_reason = error.message;
            delivery.response_data = { error: error.message };
            return false;
        }
    }
    formatEmailContent(notification) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666; }
          .priority-high { border-left: 4px solid #dc3545; }
          .priority-medium { border-left: 4px solid #ffc107; }
          .priority-low { border-left: 4px solid #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CashWise Notification</h1>
          </div>
          <div class="content priority-${notification.priority}">
            ${notification.content}
          </div>
          <div class="footer">
            <p>This is an automated message from CashWise. Please do not reply to this email.</p>
            <p>© ${new Date().getFullYear()} CashWise Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('SMTP connection verified');
            return true;
        }
        catch (error) {
            this.logger.error(`SMTP connection failed: ${error.message}`);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map