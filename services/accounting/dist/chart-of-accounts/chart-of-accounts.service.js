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
exports.ChartOfAccountsService = void 0;
const common_1 = require("@nestjs/common");
const gl_accounts_service_1 = require("../gl-accounts/gl-accounts.service");
let ChartOfAccountsService = class ChartOfAccountsService {
    constructor(glAccountsService) {
        this.glAccountsService = glAccountsService;
    }
    async getHierarchicalChart() {
        const allAccounts = await this.glAccountsService.findAll({ is_active: true });
        const accountMap = new Map();
        const childrenMap = new Map();
        allAccounts.forEach(account => {
            accountMap.set(account.id, account);
            if (account.parent_account_id) {
                if (!childrenMap.has(account.parent_account_id)) {
                    childrenMap.set(account.parent_account_id, []);
                }
                childrenMap.get(account.parent_account_id).push(account);
            }
        });
        const rootAccounts = allAccounts.filter(account => !account.parent_account_id);
        return rootAccounts.map(account => this.buildChartNode(account, childrenMap, 0, [])).sort((a, b) => a.account.account_code.localeCompare(b.account.account_code));
    }
    async getAccountsByType(accountType) {
        return this.glAccountsService.findAll({
            account_type: accountType,
            is_active: true
        });
    }
    async getBalanceSheet() {
        const chart = await this.getHierarchicalChart();
        const assets = this.filterByAccountType(chart, 'asset');
        const liabilities = this.filterByAccountType(chart, 'liability');
        const equity = this.filterByAccountType(chart, 'equity');
        return {
            assets,
            liabilities,
            equity,
            total_assets: this.calculateTotal(assets),
            total_liabilities: this.calculateTotal(liabilities),
            total_equity: this.calculateTotal(equity),
        };
    }
    async getIncomeStatement() {
        const chart = await this.getHierarchicalChart();
        const revenue = this.filterByAccountType(chart, 'revenue');
        const expenses = this.filterByAccountType(chart, 'expense');
        const totalRevenue = this.calculateTotal(revenue);
        const totalExpenses = this.calculateTotal(expenses);
        return {
            revenue,
            expenses,
            total_revenue: totalRevenue,
            total_expenses: totalExpenses,
            net_income: totalRevenue - totalExpenses,
        };
    }
    async searchAccounts(query) {
        const allAccounts = await this.glAccountsService.findAll({ is_active: true });
        const searchTerm = query.toLowerCase();
        return allAccounts.filter(account => account.account_code.toLowerCase().includes(searchTerm) ||
            account.account_name.toLowerCase().includes(searchTerm) ||
            account.description?.toLowerCase().includes(searchTerm));
    }
    async validateChartStructure() {
        const allAccounts = await this.glAccountsService.findAll();
        const errors = [];
        const warnings = [];
        for (const account of allAccounts) {
            if (await this.hasCircularReference(account, allAccounts)) {
                errors.push(`Circular reference detected for account ${account.account_code}`);
            }
        }
        const validParentIds = new Set(allAccounts.map(a => a.id));
        for (const account of allAccounts) {
            if (account.parent_account_id && !validParentIds.has(account.parent_account_id)) {
                errors.push(`Account ${account.account_code} has invalid parent reference`);
            }
        }
        const accountTypes = new Set(allAccounts.map(a => a.account_type));
        const requiredTypes = ['asset', 'liability', 'equity', 'revenue', 'expense'];
        for (const type of requiredTypes) {
            if (!accountTypes.has(type)) {
                warnings.push(`No accounts found for required type: ${type}`);
            }
        }
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
        };
    }
    buildChartNode(account, childrenMap, level, path) {
        const children = childrenMap.get(account.id) || [];
        const currentPath = [...path, account.account_code];
        return {
            account,
            level,
            path: currentPath,
            children: children
                .map(child => this.buildChartNode(child, childrenMap, level + 1, currentPath))
                .sort((a, b) => a.account.account_code.localeCompare(b.account.account_code)),
        };
    }
    filterByAccountType(nodes, accountType) {
        const result = [];
        for (const node of nodes) {
            if (node.account.account_type === accountType) {
                result.push(node);
            }
            else {
                const childMatches = this.filterByAccountType(node.children, accountType);
                result.push(...childMatches);
            }
        }
        return result;
    }
    calculateTotal(nodes) {
        let total = 0;
        for (const node of nodes) {
            total += Number(node.account.current_balance || 0);
            total += this.calculateTotal(node.children);
        }
        return total;
    }
    async hasCircularReference(account, allAccounts, visited = new Set()) {
        if (visited.has(account.id)) {
            return true;
        }
        if (!account.parent_account_id) {
            return false;
        }
        visited.add(account.id);
        const parent = allAccounts.find(a => a.id === account.parent_account_id);
        if (!parent) {
            return false;
        }
        return this.hasCircularReference(parent, allAccounts, visited);
    }
};
exports.ChartOfAccountsService = ChartOfAccountsService;
exports.ChartOfAccountsService = ChartOfAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gl_accounts_service_1.GLAccountsService])
], ChartOfAccountsService);
//# sourceMappingURL=chart-of-accounts.service.js.map