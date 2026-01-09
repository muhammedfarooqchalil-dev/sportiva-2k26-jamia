import React, { useState, useMemo } from 'react';
import { Result, SportEvent, GroupColor, EventType } from '../types';
import { Card } from './ui/Card';

interface ResultsFeedProps {
  results: Result[];
  events: SportEvent[];
}

export const ResultsFeed: React.FC<ResultsFeedProps> = ({ results, events }) => {
  const [filterGroup, setFilterGroup] = useState<GroupColor | 'All'>('All');
  const [filterType, setFilterType] = useState<EventType | 'All'>('All');

  // Enhance results with event names for display
  const enrichedResults = useMemo(() => {
    return results.map(r => {
      const event = events.find(e => e.id === r.eventId);
      return { ...r, eventName: event?.name || 'Unknown Event', eventType: event?.type || EventType.GAMES };
    }).reverse(); // Newest first
  }, [results, events]);

  const filteredResults = enrichedResults.filter(r => {
    const groupMatch = filterGroup === 'All' || r.group === filterGroup;
    const typeMatch = filterType === 'All' || r.eventType === filterType;
    return groupMatch && typeMatch;
  });

  const getBadgeColor = (position: number) => {
    if (position === 1) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
    if (position === 2) return 'bg-gray-400/20 text-gray-300 border-gray-400/50';
    return 'bg-amber-700/20 text-amber-400 border-amber-700/50';
  };

  const getGroupDot = (group: string) => {
    const color = group === 'Green' ? 'bg-sport-green' : group === 'Red' ? 'bg-sport-red' : 'bg-sport-blue';
    return <span className={`inline-block w-3 h-3 rounded-full mr-2 ${color}`}></span>;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Latest Results</h2>
        
        <div className="flex gap-2">
           <select 
            value={filterGroup} 
            onChange={(e) => setFilterGroup(e.target.value as any)}
            className="bg-gray-800 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 border border-gray-700"
          >
            <option value="All">All Groups</option>
            <option value="Green">Green</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
          </select>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-gray-800 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 border border-gray-700"
          >
            <option value="All">All Events</option>
            <option value={EventType.ATHLETICS}>Athletics</option>
            <option value={EventType.GAMES}>Games</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 bg-gray-900/50 rounded-lg">
            No results found matching your filters.
          </div>
        ) : (
          filteredResults.map((result) => (
            <Card key={result.id} className="hover:border-indigo-500/50 transition-colors">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-900 text-indigo-300 border border-indigo-800">
                    {result.eventType}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getBadgeColor(result.position)}`}>
                    {result.position === 1 ? '1st Place' : result.position === 2 ? '2nd Place' : '3rd Place'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 truncate" title={result.eventName}>
                  {result.eventName}
                </h3>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {getGroupDot(result.group)}
                    <div>
                      <p className="text-sm font-medium text-white">{result.studentName}</p>
                      <p className="text-xs text-gray-500">{result.studentRegisterNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-white">+{result.points}</span>
                    <span className="text-xs text-gray-400">points</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};