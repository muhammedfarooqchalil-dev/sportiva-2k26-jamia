import React, { useState } from 'react';
import { SportEvent, Result, GroupColor, EventType } from '../types';
import { addEvent, addResult, deleteEvent, deleteResult, resetDatabase } from '../services/db';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface AdminDashboardProps {
  events: SportEvent[];
  results: Result[];
  onUpdate: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ events, results, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'events' | 'results' | 'settings'>('results');
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Form States
  const [newEventName, setNewEventName] = useState('');
  const [newEventType, setNewEventType] = useState<EventType>(EventType.ATHLETICS);
  
  const [resultEventId, setResultEventId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [group, setGroup] = useState<GroupColor>('Green');
  const [position, setPosition] = useState<1 | 2 | 3>(1);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;
    try {
      addEvent(newEventName, newEventType);
      setNewEventName('');
      onUpdate();
      showMessage('Event added successfully', 'success');
    } catch (err) {
      showMessage('Failed to add event', 'error');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure? This will delete all associated results.')) {
      deleteEvent(id);
      onUpdate();
      showMessage('Event deleted', 'success');
    }
  };

  const handleAddResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultEventId || !studentName || !regNo) {
        showMessage('Please fill all fields', 'error');
        return;
    }
    try {
      addResult(resultEventId, studentName, regNo, group, position);
      setStudentName('');
      setRegNo('');
      onUpdate();
      showMessage('Result published!', 'success');
    } catch (err: any) {
      showMessage(err.message || 'Error adding result', 'error');
    }
  };

  const handleDeleteResult = (id: string) => {
    if (window.confirm('Delete this result?')) {
      deleteResult(id);
      onUpdate();
      showMessage('Result removed', 'success');
    }
  };

  const handleReset = () => {
      if(window.confirm('DANGER: This will wipe all data. Are you sure?')) {
          resetDatabase();
      }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
          {(['results', 'events', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-900/50 border-green-800 text-green-200' : 'bg-red-900/50 border-red-800 text-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* --- RESULTS TAB --- */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Add New Result</h3>
              <form onSubmit={handleAddResult} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Event</label>
                  <select 
                    value={resultEventId}
                    onChange={(e) => setResultEventId(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select Event...</option>
                    {events.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setPosition(pos as 1|2|3)}
                          className={`flex-1 py-2 rounded-lg font-bold border ${
                            position === pos 
                              ? 'bg-indigo-600 border-indigo-500 text-white' 
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {pos === 1 ? '1st' : pos === 2 ? '2nd' : '3rd'}
                        </button>
                      ))}
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Group</label>
                    <select 
                        value={group}
                        onChange={(e) => setGroup(e.target.value as GroupColor)}
                        className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5"
                    >
                        <option value="Green">Green</option>
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Register No.</label>
                  <input
                    type="text"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5"
                    placeholder="e.g. 12345"
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-4">Publish Result</Button>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Published Results</h3>
              {results.length === 0 && <p className="text-gray-500">No results published yet.</p>}
              {results.slice().reverse().map(result => {
                  const event = events.find(e => e.id === result.eventId);
                  return (
                    <div key={result.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex justify-between items-center group">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-white text-lg">{event?.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${result.position === 1 ? 'bg-yellow-900 text-yellow-200' : result.position === 2 ? 'bg-gray-700 text-gray-200' : 'bg-amber-900 text-amber-200'}`}>
                                    {result.position === 1 ? '1st' : result.position === 2 ? '2nd' : '3rd'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                <span className={`font-semibold ${result.group === 'Green' ? 'text-green-400' : result.group === 'Red' ? 'text-red-400' : 'text-blue-400'}`}>{result.group} Group</span> • {result.studentName} ({result.studentRegisterNumber})
                            </div>
                        </div>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteResult(result.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete
                        </Button>
                    </div>
                  );
              })}
          </div>
        </div>
      )}

      {/* --- EVENTS TAB --- */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <Card className="p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-6 text-white border-b border-gray-700 pb-2">Add Event</h3>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Event Name</label>
                            <input
                                type="text"
                                value={newEventName}
                                onChange={(e) => setNewEventName(e.target.value)}
                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5"
                                placeholder="e.g. 100m Dash"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                             <select 
                                value={newEventType}
                                onChange={(e) => setNewEventType(e.target.value as EventType)}
                                className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5"
                            >
                                <option value={EventType.ATHLETICS}>Athletics</option>
                                <option value={EventType.GAMES}>Games</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">Create Event</Button>
                    </form>
                 </Card>
            </div>
            <div className="lg:col-span-2">
                 <h3 className="text-xl font-bold text-white mb-4">Event List</h3>
                 <div className="bg-card-bg rounded-lg border border-gray-700 overflow-hidden">
                     <table className="w-full text-left text-sm text-gray-400">
                         <thead className="bg-gray-800 text-gray-200 uppercase">
                             <tr>
                                 <th className="px-6 py-3">Name</th>
                                 <th className="px-6 py-3">Type</th>
                                 <th className="px-6 py-3">Status</th>
                                 <th className="px-6 py-3 text-right">Actions</th>
                             </tr>
                         </thead>
                         <tbody>
                             {events.map(event => (
                                 <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                     <td className="px-6 py-4 font-medium text-white">{event.name}</td>
                                     <td className="px-6 py-4">{event.type}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs ${event.isCompleted ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
                                             {event.isCompleted ? 'Finished' : 'Upcoming'}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-right">
                                         <button 
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="text-red-400 hover:text-red-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </div>
        </div>
      )}

      {/* --- SETTINGS TAB --- */}
      {activeTab === 'settings' && (
          <div className="max-w-xl">
              <Card className="p-6 border-red-900/50 bg-red-900/10">
                  <h3 className="text-xl font-bold text-red-500 mb-4">Danger Zone</h3>
                  <p className="text-gray-300 mb-6">Resetting the database will permanently delete all events, results, and student data. This cannot be undone.</p>
                  <Button variant="danger" onClick={handleReset}>Reset All Data</Button>
              </Card>
          </div>
      )}
    </div>
  );
};