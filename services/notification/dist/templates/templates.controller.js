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
exports.TemplatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const templates_service_1 = require("./templates.service");
const create_template_dto_1 = require("./dto/create-template.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let TemplatesController = class TemplatesController {
    constructor(templatesService) {
        this.templatesService = templatesService;
    }
    async create(createTemplateDto) {
        return this.templatesService.create(createTemplateDto);
    }
    async initializeSystemTemplates() {
        return this.templatesService.initializeSystemTemplates();
    }
    async findAll(category, channel, is_active) {
        const filters = { category, channel, is_active };
        return this.templatesService.findAll(filters);
    }
    async findOne(id) {
        return this.templatesService.findOne(id);
    }
    async findByName(name) {
        return this.templatesService.findByName(name);
    }
    async preview(id, data) {
        return this.templatesService.preview(id, data);
    }
    async update(id, updateData) {
        return this.templatesService.update(id, updateData);
    }
    async deactivate(id) {
        return this.templatesService.deactivate(id);
    }
};
exports.TemplatesController = TemplatesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new notification template' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Template created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid template data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_template_dto_1.CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('initialize-system'),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize system templates' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'System templates initialized' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'System templates already exist' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "initializeSystemTemplates", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notification templates' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'channel', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'is_active', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('channel')),
    __param(2, (0, common_1.Query)('is_active', new common_1.ParseBoolPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a template by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a template by name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "findByName", null);
__decorate([
    (0, common_1.Post)(':id/preview'),
    (0, swagger_1.ApiOperation)({ summary: 'Preview template with sample data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template preview generated' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "preview", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot modify system template' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a template' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Template deactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot deactivate system template' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TemplatesController.prototype, "deactivate", null);
exports.TemplatesController = TemplatesController = __decorate([
    (0, swagger_1.ApiTags)('Templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('templates'),
    __metadata("design:paramtypes", [templates_service_1.TemplatesService])
], TemplatesController);
//# sourceMappingURL=templates.controller.js.map