import React, { useState } from 'react';
import { login } from '../services/auth';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      onLoginSuccess();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md p-8 border-indigo-500/30">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white">Admin Access</h2>
            <p className="text-gray-400 mt-2">Enter your credentials to manage results.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white text-lg rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
              placeholder="••••••••"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-500">
             Note: Use "admin123" for demo access.
        </div>
      </Card>
    </div>
  );
};