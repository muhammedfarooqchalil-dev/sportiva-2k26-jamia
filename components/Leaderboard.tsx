import React from 'react';
import { GroupScore } from '../types';
import { Card } from './ui/Card';

interface LeaderboardProps {
  scores: GroupScore[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  // Sort guarantees order, but let's handle visual layout for Top 3
  const first = scores[0];
  const second = scores[1];
  const third = scores[2];

  const getColorClass = (group: string) => {
    switch (group) {
      case 'Green': return 'bg-sport-green';
      case 'Red': return 'bg-sport-red';
      case 'Blue': return 'bg-sport-blue';
      default: return 'bg-gray-500';
    }
  };

  const getTrophyColor = (position: number) => {
    switch (position) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  const StatPill = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center mx-1 sm:mx-2">
      <span className="text-xs sm:text-sm text-gray-400 uppercase font-bold tracking-wider">{label}</span>
      <span className="text-sm sm:text-lg font-bold text-white">{value}</span>
    </div>
  );

  return (
    <div className="w-full mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Live Leaderboard</h2>
      
      {/* Mobile/Desktop responsive grid */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 min-h-[300px]">
        
        {/* Second Place */}
        {second && (
          <div className="order-2 md:order-1 w-full md:w-1/3 flex flex-col items-center">
            <div className="mb-2 text-center">
              <span className={`text-4xl ${getTrophyColor(2)}`}>🥈</span>
              <h3 className="text-xl font-bold mt-1 text-gray-300">2nd Place</h3>
            </div>
            <Card className="w-full border-t-4 border-t-gray-400 relative">
               <div className={`h-2 w-full ${getColorClass(second.group)}`}></div>
               <div className="p-6 text-center">
                  <h4 className={`text-3xl font-black ${second.group === 'Green' ? 'text-emerald-400' : second.group === 'Red' ? 'text-rose-400' : 'text-blue-400'}`}>{second.group}</h4>
                  <div className="text-5xl font-bold my-4 text-white">{second.totalPoints} <span className="text-lg font-normal text-gray-400">pts</span></div>
                  <div className="flex justify-center border-t border-gray-700 pt-4 mt-2">
                    <StatPill label="🥇" value={second.golds} />
                    <StatPill label="🥈" value={second.silvers} />
                    <StatPill label="🥉" value={second.bronzes} />
                  </div>
               </div>
            </Card>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="order-1 md:order-2 w-full md:w-1/3 flex flex-col items-center -mt-8 md:-mt-16 z-10 transform scale-105">
            <div className="mb-2 text-center animate-bounce">
              <span className={`text-6xl ${getTrophyColor(1)}`}>👑</span>
            </div>
            <Card className="w-full border-t-4 border-t-yellow-400 shadow-yellow-500/20 shadow-2xl relative">
              <div className={`h-3 w-full ${getColorClass(first.group)}`}></div>
               <div className="p-8 text-center bg-gradient-to-b from-card-bg to-gray-800">
                  <h4 className={`text-4xl font-black ${first.group === 'Green' ? 'text-emerald-400' : first.group === 'Red' ? 'text-rose-400' : 'text-blue-400'}`}>{first.group}</h4>
                  <div className="text-6xl font-bold my-4 text-white">{first.totalPoints} <span className="text-xl font-normal text-gray-400">pts</span></div>
                  <div className="flex justify-center border-t border-gray-700 pt-4 mt-2">
                    <StatPill label="🥇" value={first.golds} />
                    <StatPill label="🥈" value={first.silvers} />
                    <StatPill label="🥉" value={first.bronzes} />
                  </div>
               </div>
            </Card>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="order-3 w-full md:w-1/3 flex flex-col items-center">
            <div className="mb-2 text-center">
              <span className={`text-4xl ${getTrophyColor(3)}`}>🥉</span>
              <h3 className="text-xl font-bold mt-1 text-amber-700">3rd Place</h3>
            </div>
             <Card className="w-full border-t-4 border-t-amber-700 relative">
               <div className={`h-2 w-full ${getColorClass(third.group)}`}></div>
               <div className="p-6 text-center">
                  <h4 className={`text-3xl font-black ${third.group === 'Green' ? 'text-emerald-400' : third.group === 'Red' ? 'text-rose-400' : 'text-blue-400'}`}>{third.group}</h4>
                  <div className="text-5xl font-bold my-4 text-white">{third.totalPoints} <span className="text-lg font-normal text-gray-400">pts</span></div>
                  <div className="flex justify-center border-t border-gray-700 pt-4 mt-2">
                    <StatPill label="🥇" value={third.golds} />
                    <StatPill label="🥈" value={third.silvers} />
                    <StatPill label="🥉" value={third.bronzes} />
                  </div>
               </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};