"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelsModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./services/email.service");
const sms_service_1 = require("./services/sms.service");
const push_service_1 = require("./services/push.service");
const in_app_service_1 = require("./services/in-app.service");
let ChannelsModule = class ChannelsModule {
};
exports.ChannelsModule = ChannelsModule;
exports.ChannelsModule = ChannelsModule = __decorate([
    (0, common_1.Module)({
        providers: [email_service_1.EmailService, sms_service_1.SmsService, push_service_1.PushService, in_app_service_1.InAppService],
        exports: [email_service_1.EmailService, sms_service_1.SmsService, push_service_1.PushService, in_app_service_1.InAppService],
    })
], ChannelsModule);
//# sourceMappingURL=channels.module.js.map