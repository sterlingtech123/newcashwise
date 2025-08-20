export declare class CreateTemplateDto {
    name: string;
    description: string;
    category: string;
    channel: string;
    subject_template: string;
    content_template: string;
    variables?: string[];
    default_data?: any;
    is_active?: boolean;
    styling?: any;
    metadata?: any;
}
