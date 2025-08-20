import { StatementsService } from './statements.service';
export declare class StatementsController {
    private readonly statementsService;
    constructor(statementsService: StatementsService);
    processStatement(): Promise<{
        message: string;
    }>;
}
