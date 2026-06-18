import type { AdminEventDetail } from '@/types/event';

export interface OnePageCreateEventFormProps {
  initialData?: AdminEventDetail | null;
  isModal?: boolean;
  onClose: () => void;
}

export interface Attachment {
  key: string;
  value: string;
}

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface FormDataState {
  title: string;
  description: string;
  fees: number;
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  eventCategory: string;
  eventType: string;
  teamEvent: boolean;
  minTeamSize: any;
  maxTeamSize: any;
  maxParticipants: number;
  registrationLink: string;
  allowed_branches: number[];
  allowed_years: number[];
  publicAttachments: Attachment[];
  privateAttachments: Attachment[];
  contactDetails: Contact[];
  poster: File | null;
}
