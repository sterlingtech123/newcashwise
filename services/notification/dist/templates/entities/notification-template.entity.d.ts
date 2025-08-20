import { BaseEntity } from '../../common/entities/base.entity';
export declare class NotificationTemplate extends BaseEntity {
    name: string;
    description: string;
    category: string;
    channel: string;
    subject_template: string;
    content_template: string;
    variables: string[];
    default_data: any;
    is_active: boolean;
    is_system: boolean;
    styling: any;
    metadata: any;
    renderSubject(data: any): string;
    renderContent(data: any): string;
    private renderTemplate;
    getVariableList(): string[];
    validateData(data: any): {
        valid: boolean;
        missingVariables: string[];
    };
}
