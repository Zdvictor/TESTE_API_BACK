export interface NotificationData {
  charges?: {
    id: string;
    reference_id: string;
    status: string;
    paid_at?: string;
    amount?: {
      value: number;
      currency: string;
    };
  }[];
}
