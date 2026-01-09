import React from 'react';
import { Button } from './ui/Button';

interface NavbarProps {
  currentPage: 'home' | 'admin' | 'login';
  onNavigate: (page: 'home' | 'admin' | 'login') => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isAdmin, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex-shrink-0">
              <span className="text-2xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
                SPORTIVA 2K26
              </span>
              <span className="ml-2 text-xs text-gray-400 hidden sm:inline-block">Jamia Islamiya Arts & Science</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant={currentPage === 'home' ? 'primary' : 'ghost'} 
              onClick={() => onNavigate('home')}
              size="sm"
            >
              Results & Live
            </Button>
            
            {isAdmin ? (
               <>
                <Button 
                  variant={currentPage === 'admin' ? 'primary' : 'ghost'} 
                  onClick={() => onNavigate('admin')}
                  size="sm"
                >
                  Admin Panel
                </Button>
                <Button variant="danger" size="sm" onClick={onLogout}>Logout</Button>
               </>
            ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('login')}
                  size="sm"
                >
                  Admin Login
                </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};