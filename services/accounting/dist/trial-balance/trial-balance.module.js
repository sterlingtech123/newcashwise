"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialBalanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trial_balance_service_1 = require("./trial-balance.service");
const trial_balance_controller_1 = require("./trial-balance.controller");
const trial_balance_entity_1 = require("./entities/trial-balance.entity");
const gl_account_entity_1 = require("../gl-accounts/entities/gl-account.entity");
const journal_entry_line_entity_1 = require("../journal-entries/entities/journal-entry-line.entity");
let TrialBalanceModule = class TrialBalanceModule {
};
exports.TrialBalanceModule = TrialBalanceModule;
exports.TrialBalanceModule = TrialBalanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                trial_balance_entity_1.TrialBalanceSnapshot,
                gl_account_entity_1.GLAccount,
                journal_entry_line_entity_1.JournalEntryLine,
            ]),
        ],
        controllers: [trial_balance_controller_1.TrialBalanceController],
        providers: [trial_balance_service_1.TrialBalanceService],
        exports: [trial_balance_service_1.TrialBalanceService],
    })
], TrialBalanceModule);
//# sourceMappingURL=trial-balance.module.js.map