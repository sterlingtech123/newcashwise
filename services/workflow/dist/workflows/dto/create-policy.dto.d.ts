export declare class CreatePolicyDto {
    name: string;
    description?: string;
    policyType: string;
    conditions?: any;
    isActive?: boolean;
    priority?: number;
    stages: Array<{
        stageName: string;
        roleRequirements: string[];
        userRequirements?: string[];
        minApprovers?: number;
        maxApprovers?: number;
        isParallel?: boolean;
        conditions?: any;
    }>;
}
