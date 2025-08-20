export class ApproveTaskDto {
  userId: string;
  decision: 'approved' | 'rejected';
  comments?: string;
}
