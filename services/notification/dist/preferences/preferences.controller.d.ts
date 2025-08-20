import { PreferencesService } from './preferences.service';
export declare class PreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: PreferencesService);
    getUserPreferences(userId?: string): Promise<{
        userId: string;
        tenantId: string;
        preferences: {
            email: {
                enabled: boolean;
                categories: {
                    payment: boolean;
                    budget: boolean;
                    workflow: boolean;
                    system: boolean;
                };
            };
            sms: {
                enabled: boolean;
                categories: {
                    payment: boolean;
                    budget: boolean;
                    workflow: boolean;
                    system: boolean;
                };
            };
            push: {
                enabled: boolean;
                categories: {
                    payment: boolean;
                    budget: boolean;
                    workflow: boolean;
                    system: boolean;
                };
            };
            in_app: {
                enabled: boolean;
                categories: {
                    payment: boolean;
                    budget: boolean;
                    workflow: boolean;
                    system: boolean;
                };
            };
        };
        quietHours: {
            enabled: boolean;
            startTime: string;
            endTime: string;
            timezone: string;
        };
    }>;
    updatePreferences(preferences: any): Promise<{
        success: boolean;
        preferences: any;
    }>;
}
