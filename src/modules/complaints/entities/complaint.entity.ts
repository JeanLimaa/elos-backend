export class Complaint {
  id: string;
  userId: string;
  description: string;
  location: string;
  eventDate?: string;
  createdAt: Date;
  status: string;
  response?: string;
  attachments: string[];
  anonymous: boolean;
}
