// Simple mock authentication
const AUTH_KEY = 'sportiva_admin_session';

export const login = (password: string): boolean => {
  // Hardcoded password for demo purposes
  if (password === 'admin123') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};