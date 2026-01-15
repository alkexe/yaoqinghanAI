
export type EventType = 'Wedding' | 'Birthday' | 'Corporate' | 'Tech' | 'Party';

export interface StyleSeries {
  id: string;
  name: string;
  colorClass: string;
  description: string;
}

export type ViewState = 'landing' | 'workspace';

export interface GeneratedInvitation {
  imageUrl: string;
  eventType: EventType;
  prompt: string;
  style: string;
  timestamp: number;
}
