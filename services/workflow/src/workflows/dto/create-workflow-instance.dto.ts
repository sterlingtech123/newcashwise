export class CreateWorkflowInstanceDto {
  entityType: string;
  entityId: string;
  initiatedBy: string;
  entityData?: any;
  metadata?: any;
}
