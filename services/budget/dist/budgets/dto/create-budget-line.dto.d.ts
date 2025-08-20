export declare class CreateBudgetLineDto {
    budgetVersionId: string;
    organizationId: string;
    fundId: string;
    functionId: string;
    economicHeadId: string;
    programId?: string;
    projectId?: string;
    lineNumber: string;
    description: string;
    approvedAmount: number;
    tags?: string[];
}
