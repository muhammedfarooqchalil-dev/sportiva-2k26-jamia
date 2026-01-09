import { DatabaseSchema, EventType, Result, SportEvent, GroupColor, GroupScore } from '../types';

const DB_KEY = 'sportiva_2k26_db';

// Points configuration
const POINTS = {
  1: 10, // 1st Place
  2: 5,  // 2nd Place
  3: 3   // 3rd Place
};

const INITIAL_DATA: DatabaseSchema = {
  events: [
    { id: '1', name: '100m Sprint', type: EventType.ATHLETICS, isCompleted: false },
    { id: '2', name: 'Football', type: EventType.GAMES, isCompleted: false },
    { id: '3', name: 'Relay 4x100', type: EventType.ATHLETICS, isCompleted: false },
    { id: '4', name: 'Volleyball', type: EventType.GAMES, isCompleted: false },
    { id: '5', name: 'Shot Put', type: EventType.ATHLETICS, isCompleted: false },
  ],
  results: []
};

// Initialize DB if not exists
const initDB = (): DatabaseSchema => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(existing);
};

export const getDB = (): DatabaseSchema => {
  return initDB();
};

export const saveDB = (data: DatabaseSchema) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

// --- API Methods ---

export const getEvents = (): SportEvent[] => {
  return getDB().events;
};

export const addEvent = (name: string, type: EventType): SportEvent => {
  const db = getDB();
  const newEvent: SportEvent = {
    id: Date.now().toString(),
    name,
    type,
    isCompleted: false
  };
  db.events.push(newEvent);
  saveDB(db);
  return newEvent;
};

export const deleteEvent = (id: string) => {
  const db = getDB();
  db.events = db.events.filter(e => e.id !== id);
  // Also delete associated results
  db.results = db.results.filter(r => r.eventId !== id);
  saveDB(db);
};

export const getResults = (): Result[] => {
  return getDB().results;
};

export const addResult = (eventId: string, studentName: string, regNo: string, group: GroupColor, position: 1 | 2 | 3) => {
  const db = getDB();
  const event = db.events.find(e => e.id === eventId);
  if (!event) throw new Error("Event not found");

  // Check if position already taken for this event
  const existingPosition = db.results.find(r => r.eventId === eventId && r.position === position);
  if (existingPosition) {
    throw new Error(`Position ${position} is already taken for this event.`);
  }

  const newResult: Result = {
    id: Date.now().toString(),
    eventId,
    studentName,
    studentRegisterNumber: regNo,
    group,
    position,
    points: POINTS[position]
  };

  db.results.push(newResult);
  
  // Check if event is now "complete" (has 1st, 2nd, 3rd) - optional logic
  // For simplicity, we just mark event completed if at least one result exists or manually toggle.
  // Let's just update the event status to completed if it was not.
  if(!event.isCompleted) {
      event.isCompleted = true; // Simple logic: if a result is added, it's in progress/completed
  }
  
  // Update event in DB
  const eventIndex = db.events.findIndex(e => e.id === eventId);
  if (eventIndex >= 0) db.events[eventIndex] = event;

  saveDB(db);
  return newResult;
};

export const deleteResult = (resultId: string) => {
  const db = getDB();
  db.results = db.results.filter(r => r.id !== resultId);
  saveDB(db);
};

export const calculateLeaderboard = (): GroupScore[] => {
  const db = getDB();
  const scores: Record<GroupColor, GroupScore> = {
    Green: { group: 'Green', totalPoints: 0, golds: 0, silvers: 0, bronzes: 0 },
    Red: { group: 'Red', totalPoints: 0, golds: 0, silvers: 0, bronzes: 0 },
    Blue: { group: 'Blue', totalPoints: 0, golds: 0, silvers: 0, bronzes: 0 }
  };

  db.results.forEach(result => {
    const group = scores[result.group];
    group.totalPoints += result.points;
    if (result.position === 1) group.golds++;
    if (result.position === 2) group.silvers++;
    if (result.position === 3) group.bronzes++;
  });

  return Object.values(scores).sort((a, b) => b.totalPoints - a.totalPoints);
};

export const resetDatabase = () => {
    localStorage.removeItem(DB_KEY);
    window.location.reload();
}