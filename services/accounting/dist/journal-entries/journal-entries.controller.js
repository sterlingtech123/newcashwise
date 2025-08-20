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
exports.JournalEntriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const journal_entries_service_1 = require("./journal-entries.service");
const create_journal_entry_dto_1 = require("./dto/create-journal-entry.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let JournalEntriesController = class JournalEntriesController {
    constructor(journalEntriesService) {
        this.journalEntriesService = journalEntriesService;
    }
    async create(createJournalEntryDto) {
        return this.journalEntriesService.create(createJournalEntryDto);
    }
    async findAll(page, limit, status, source_type, date_from, date_to) {
        const filters = { status, source_type, date_from, date_to };
        return this.journalEntriesService.findAll(page, limit, filters);
    }
    async findOne(id) {
        return this.journalEntriesService.findOne(id);
    }
    async postEntry(id) {
        return this.journalEntriesService.postEntry(id);
    }
    async reverseEntry(id, body) {
        return this.journalEntriesService.reverseEntry(id, body.reason);
    }
};
exports.JournalEntriesController = JournalEntriesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new journal entry' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Journal entry created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid journal entry data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_journal_entry_dto_1.CreateJournalEntryDto]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all journal entries' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'source_type', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_from', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'date_to', required: false, type: String }),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('source_type')),
    __param(4, (0, common_1.Query)('date_from')),
    __param(5, (0, common_1.Query)('date_to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a journal entry by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journal entry found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Journal entry not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/post'),
    (0, swagger_1.ApiOperation)({ summary: 'Post a journal entry to the general ledger' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journal entry posted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot post this journal entry' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "postEntry", null);
__decorate([
    (0, common_1.Post)(':id/reverse'),
    (0, swagger_1.ApiOperation)({ summary: 'Reverse a posted journal entry' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Journal entry reversed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot reverse this journal entry' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JournalEntriesController.prototype, "reverseEntry", null);
exports.JournalEntriesController = JournalEntriesController = __decorate([
    (0, swagger_1.ApiTags)('Journal Entries'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('journal-entries'),
    __metadata("design:paramtypes", [journal_entries_service_1.JournalEntriesService])
], JournalEntriesController);
//# sourceMappingURL=journal-entries.controller.js.map