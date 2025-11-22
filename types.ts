export enum EventType {
  REGISTRATION = 'REGISTRATION',
  QUERY = 'QUERY',
  EXAM = 'EXAM',
  RESULTS = 'RESULTS',
  REVIEW = 'REVIEW',
  SELECTION = 'SELECTION',
  ADMISSION = 'ADMISSION'
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date; // If it's a range
  type: EventType;
  isMainExam?: boolean;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}