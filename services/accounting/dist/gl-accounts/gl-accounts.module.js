"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLAccountsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const gl_accounts_service_1 = require("./gl-accounts.service");
const gl_accounts_controller_1 = require("./gl-accounts.controller");
const gl_account_entity_1 = require("./entities/gl-account.entity");
const audit_log_entity_1 = require("../common/entities/audit-log.entity");
let GLAccountsModule = class GLAccountsModule {
};
exports.GLAccountsModule = GLAccountsModule;
exports.GLAccountsModule = GLAccountsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                gl_account_entity_1.GLAccount,
                audit_log_entity_1.AuditLog,
            ]),
        ],
        controllers: [gl_accounts_controller_1.GLAccountsController],
        providers: [gl_accounts_service_1.GLAccountsService],
        exports: [gl_accounts_service_1.GLAccountsService],
    })
], GLAccountsModule);
//# sourceMappingURL=gl-accounts.module.js.map