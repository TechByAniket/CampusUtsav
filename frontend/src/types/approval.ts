export interface ApprovalLog {
  id: number;
  eventId: number;
  fromStatus: string;
  toStatus: string;
  action: string;
  actionBy: string;
  remarks: string;
  timestamp: string;
  version: number;
}
