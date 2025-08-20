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
exports.StatementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const statements_service_1 = require("./statements.service");
const auth_guard_1 = require("../auth/guards/auth.guard");
let StatementsController = class StatementsController {
    constructor(statementsService) {
        this.statementsService = statementsService;
    }
    async processStatement() {
        return this.statementsService.processStatement();
    }
};
exports.StatementsController = StatementsController;
__decorate([
    (0, common_1.Post)('process'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatementsController.prototype, "processStatement", null);
exports.StatementsController = StatementsController = __decorate([
    (0, swagger_1.ApiTags)('Statements'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('statements'),
    __metadata("design:paramtypes", [statements_service_1.StatementsService])
], StatementsController);
//# sourceMappingURL=statements.controller.js.map