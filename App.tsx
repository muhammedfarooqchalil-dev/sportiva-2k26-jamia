import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Leaderboard } from './components/Leaderboard';
import { ResultsFeed } from './components/ResultsFeed';
import { AdminDashboard } from './components/AdminDashboard';
import { Login } from './components/Login';
import { getEvents, getResults, calculateLeaderboard, getDB } from './services/db';
import { isAuthenticated, logout } from './services/auth';
import { SportEvent, Result, GroupScore } from './types';

function App() {
  const [page, setPage] = useState<'home' | 'admin' | 'login'>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Data State
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [scores, setScores] = useState<GroupScore[]>([]);
  const [dataVersion, setDataVersion] = useState(0); // Trigger re-renders on DB update

  // Load Data
  useEffect(() => {
    // Check initial auth state
    setIsAdmin(isAuthenticated());

    // Load DB data
    const db = getDB(); // Initializes if empty
    setEvents(db.events);
    setResults(db.results);
    setScores(calculateLeaderboard());

  }, [dataVersion]);

  // Handle updates from Admin Panel
  const handleDataUpdate = () => {
    setDataVersion(prev => prev + 1);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setPage('admin');
  };

  const handleLogout = () => {
    logout();
    setIsAdmin(false);
    setPage('home');
  };

  const handleNavigate = (target: 'home' | 'admin' | 'login') => {
      if (target === 'admin' && !isAdmin) {
          setPage('login');
      } else {
          setPage(target);
      }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-indigo-500/30">
      <Navbar 
        currentPage={page} 
        onNavigate={handleNavigate} 
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {page === 'home' && (
          <div className="space-y-12 animate-fade-in">
             <section>
                 <Leaderboard scores={scores} />
             </section>
             <section>
                 <ResultsFeed results={results} events={events} />
             </section>
          </div>
        )}

        {page === 'login' && (
            <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {page === 'admin' && isAdmin && (
            <AdminDashboard 
                events={events} 
                results={results} 
                onUpdate={handleDataUpdate} 
            />
        )}
      </main>

      <footer className="border-t border-gray-800 mt-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
              <p>&copy; 2026 Sportiva Annual Sports Meet. Jamia Islamiya Arts and Science College.</p>
              <p className="mt-2">Built with ❤️ for sports.</p>
          </div>
      </footer>
    </div>
  );
}

export default App;