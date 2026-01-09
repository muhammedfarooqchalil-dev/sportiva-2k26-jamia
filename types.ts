export type GroupColor = 'Green' | 'Red' | 'Blue';

export enum EventType {
  GAMES = 'Games',
  ATHLETICS = 'Athletics'
}

export interface Student {
  id: string;
  name: string;
  registerNumber: string;
  group: GroupColor;
}

export interface SportEvent {
  id: string;
  name: string;
  type: EventType;
  isCompleted: boolean;
}

export interface Result {
  id: string;
  eventId: string;
  studentName: string;
  studentRegisterNumber: string;
  group: GroupColor;
  position: 1 | 2 | 3;
  points: number;
}

export interface GroupScore {
  group: GroupColor;
  totalPoints: number;
  golds: number;
  silvers: number;
  bronzes: number;
}

// Database Schema interface for our LocalStorage implementation
export interface DatabaseSchema {
  events: SportEvent[];
  results: Result[];
}