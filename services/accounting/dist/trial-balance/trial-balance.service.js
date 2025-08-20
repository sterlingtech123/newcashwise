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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrialBalanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const decimal_js_1 = require("decimal.js");
const trial_balance_entity_1 = require("./entities/trial-balance.entity");
const gl_account_entity_1 = require("../gl-accounts/entities/gl-account.entity");
const journal_entry_line_entity_1 = require("../journal-entries/entities/journal-entry-line.entity");
const tenant_service_1 = require("../common/services/tenant.service");
let TrialBalanceService = class TrialBalanceService {
    constructor(trialBalanceRepository, glAccountRepository, journalEntryLineRepository, tenantService) {
        this.trialBalanceRepository = trialBalanceRepository;
        this.glAccountRepository = glAccountRepository;
        this.journalEntryLineRepository = journalEntryLineRepository;
        this.tenantService = tenantService;
    }
    async generateTrialBalance(periodStart, periodEnd, accountTypes) {
        const tenantId = this.tenantService.getCurrentTenantId();
        let accountQuery = this.glAccountRepository
            .createQueryBuilder('account')
            .where('account.tenant_id = :tenantId', { tenantId })
            .andWhere('account.is_active = true');
        if (accountTypes && accountTypes.length > 0) {
            accountQuery = accountQuery.andWhere('account.account_type IN (:...accountTypes)', {
                accountTypes
            });
        }
        const accounts = await accountQuery.getMany();
        const trialBalanceEntries = [];
        for (const account of accounts) {
            const periodActivity = await this.calculatePeriodActivity(account.id, periodStart, periodEnd);
            const openingBalance = await this.calculateOpeningBalance(account.id, periodStart);
            const closingBalance = openingBalance
                .plus(periodActivity.debits)
                .minus(periodActivity.credits);
            let debitBalance = 0;
            let creditBalance = 0;
            if (account.hasNormalDebitBalance()) {
                if (closingBalance.gte(0)) {
                    debitBalance = closingBalance.toNumber();
                }
                else {
                    creditBalance = closingBalance.abs().toNumber();
                }
            }
            else {
                if (closingBalance.gte(0)) {
                    creditBalance = closingBalance.toNumber();
                }
                else {
                    debitBalance = closingBalance.abs().toNumber();
                }
            }
            trialBalanceEntries.push({
                account_code: account.account_code,
                account_name: account.account_name,
                account_type: account.account_type,
                debit_balance: debitBalance,
                credit_balance: creditBalance,
                net_balance: closingBalance.toNumber(),
            });
        }
        return trialBalanceEntries.sort((a, b) => a.account_code.localeCompare(b.account_code));
    }
    async generateFinancialStatements(periodStart, periodEnd) {
        const trialBalance = await this.generateTrialBalance(periodStart, periodEnd);
        const totals = trialBalance.reduce((acc, entry) => {
            switch (entry.account_type) {
                case 'asset':
                    acc.total_assets += entry.net_balance;
                    break;
                case 'liability':
                    acc.total_liabilities += entry.net_balance;
                    break;
                case 'equity':
                    acc.total_equity += entry.net_balance;
                    break;
                case 'revenue':
                    acc.total_revenue += entry.net_balance;
                    break;
                case 'expense':
                    acc.total_expenses += entry.net_balance;
                    break;
            }
            return acc;
        }, {
            total_assets: 0,
            total_liabilities: 0,
            total_equity: 0,
            total_revenue: 0,
            total_expenses: 0,
        });
        const netIncome = totals.total_revenue - totals.total_expenses;
        return {
            period_start: periodStart,
            period_end: periodEnd,
            total_assets: totals.total_assets,
            total_liabilities: totals.total_liabilities,
            total_equity: totals.total_equity,
            total_revenue: totals.total_revenue,
            total_expenses: totals.total_expenses,
            net_income: netIncome,
            entries: trialBalance,
        };
    }
    async saveTrialBalanceSnapshot(periodEndDate, entries) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const userId = this.tenantService.getCurrentUserId();
        await this.trialBalanceRepository.delete({
            tenant_id: tenantId,
            period_end_date: periodEndDate,
        });
        const snapshots = entries.map(entry => {
            const account = this.glAccountRepository.findOne({
                where: { account_code: entry.account_code, tenant_id: tenantId },
            });
            return this.trialBalanceRepository.create({
                tenant_id: tenantId,
                period_end_date: periodEndDate,
                gl_account_id: account?.id,
                account_code: entry.account_code,
                account_name: entry.account_name,
                account_type: entry.account_type,
                opening_balance: 0,
                period_debits: entry.debit_balance,
                period_credits: entry.credit_balance,
                closing_balance: entry.net_balance,
                created_by: userId,
            });
        });
        await this.trialBalanceRepository.save(snapshots);
    }
    async getTrialBalanceHistory(startDate, endDate) {
        const tenantId = this.tenantService.getCurrentTenantId();
        return this.trialBalanceRepository.find({
            where: {
                tenant_id: tenantId,
                period_end_date: (0, typeorm_2.Between)(startDate, endDate),
            },
            order: {
                period_end_date: 'DESC',
                account_code: 'ASC',
            },
        });
    }
    async validateTrialBalance(entries) {
        const totalDebits = entries.reduce((sum, entry) => sum + entry.debit_balance, 0);
        const totalCredits = entries.reduce((sum, entry) => sum + entry.credit_balance, 0);
        const difference = totalDebits - totalCredits;
        const isBalanced = Math.abs(difference) < 0.01;
        return {
            isBalanced,
            totalDebits,
            totalCredits,
            difference,
        };
    }
    async calculatePeriodActivity(accountId, periodStart, periodEnd) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const result = await this.journalEntryLineRepository
            .createQueryBuilder('line')
            .select('SUM(line.debit_amount)', 'total_debits')
            .addSelect('SUM(line.credit_amount)', 'total_credits')
            .innerJoin('line.journal_entry', 'entry')
            .where('line.tenant_id = :tenantId', { tenantId })
            .andWhere('line.gl_account_id = :accountId', { accountId })
            .andWhere('entry.status = :status', { status: 'posted' })
            .andWhere('line.line_date >= :periodStart', { periodStart })
            .andWhere('line.line_date <= :periodEnd', { periodEnd })
            .getRawOne();
        return {
            debits: new decimal_js_1.Decimal(result.total_debits || 0),
            credits: new decimal_js_1.Decimal(result.total_credits || 0),
        };
    }
    async calculateOpeningBalance(accountId, periodStart) {
        const tenantId = this.tenantService.getCurrentTenantId();
        const account = await this.glAccountRepository.findOne({
            where: { id: accountId, tenant_id: tenantId },
        });
        if (!account) {
            return new decimal_js_1.Decimal(0);
        }
        const previousActivity = await this.journalEntryLineRepository
            .createQueryBuilder('line')
            .select('SUM(line.debit_amount)', 'total_debits')
            .addSelect('SUM(line.credit_amount)', 'total_credits')
            .innerJoin('line.journal_entry', 'entry')
            .where('line.tenant_id = :tenantId', { tenantId })
            .andWhere('line.gl_account_id = :accountId', { accountId })
            .andWhere('entry.status = :status', { status: 'posted' })
            .andWhere('line.line_date < :periodStart', { periodStart })
            .getRawOne();
        const openingBalance = new decimal_js_1.Decimal(account.opening_balance || 0);
        const activityDebits = new decimal_js_1.Decimal(previousActivity.total_debits || 0);
        const activityCredits = new decimal_js_1.Decimal(previousActivity.total_credits || 0);
        if (account.hasNormalDebitBalance()) {
            return openingBalance.plus(activityDebits).minus(activityCredits);
        }
        else {
            return openingBalance.plus(activityCredits).minus(activityDebits);
        }
    }
};
exports.TrialBalanceService = TrialBalanceService;
exports.TrialBalanceService = TrialBalanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trial_balance_entity_1.TrialBalanceSnapshot)),
    __param(1, (0, typeorm_1.InjectRepository)(gl_account_entity_1.GLAccount)),
    __param(2, (0, typeorm_1.InjectRepository)(journal_entry_line_entity_1.JournalEntryLine)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        tenant_service_1.TenantService])
], TrialBalanceService);
//# sourceMappingURL=trial-balance.service.js.map