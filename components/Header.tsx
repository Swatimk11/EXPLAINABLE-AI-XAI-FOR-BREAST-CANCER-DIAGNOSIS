import React from 'react';
import type { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'auth' | 'dashboard' | 'contact') => void;
  currentPage: 'home' | 'auth' | 'dashboard' | 'contact';
  onAuthNavigate?: (view: 'login' | 'register') => void;
}

const NavLink: React.FC<{
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
  <button 
    onClick={onClick}
    className={`hover:text-pink-200 transition-colors ${isActive ? 'text-white font-bold' : 'text-pink-100'}`}
  >
    {children}
  </button>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, currentPage, onAuthNavigate }) => {
  
  const handleAuthNav = (view: 'login' | 'register') => {
    if (onAuthNavigate) {
      onAuthNavigate(view);
    }
    onNavigate('auth');
  };
  
  return (
    <header className="bg-pink-600 shadow-md text-white flex-shrink-0">
      <div className="mx-auto px-8 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* SVG Logo */}
          <svg className="h-8 w-8 text-white" xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.92,13.56c-0.34-0.41-0.73-0.81-1.12-1.2l-0.29-0.29c-0.45-0.45-0.95-0.86-1.45-1.23L9.8,10.6c-0.34-0.25-0.72-0.46-1.1-0.63 c-0.54-0.23-1.1-0.35-1.66-0.35c-0.26,0-0.51,0.03-0.76,0.08c-0.53,0.12-1,0.36-1.42,0.72c-0.71,0.6-1.13,1.48-1.09,2.44 c0.05,1.21,0.73,2.28,1.83,2.85c0.35,0.18,0.72,0.32,1.1,0.43c0.55,0.16,1.12,0.24,1.69,0.24c0.23,0,0.46-0.02,0.68-0.06 c0.77-0.14,1.47-0.5,2.05-1.02C12.63,15.28,13.06,14.48,12.92,13.56z M8.68,14.93c-0.59,0-1.14-0.12-1.62-0.35 c-0.77-0.36-1.28-1.08-1.32-1.9c-0.03-0.6,0.25-1.18,0.74-1.57c0.29-0.22,0.62-0.36,0.96-0.42c0.16-0.03,0.33-0.04,0.49-0.04 c0.39,0,0.77,0.08,1.12,0.24c0.26,0.12,0.5,0.27,0.72,0.45l0.13,0.1c0.36,0.28,0.71,0.6,1.03,0.94l0.29,0.29 c0.29,0.29,0.56,0.6,0.8,0.92c-0.44,0.61-1.07,1.04-1.8,1.2C9.88,14.88,9.28,14.93,8.68,14.93z" />
            <path d="M20.62,8.35c-0.54-0.89-1.24-1.66-2.06-2.27c-0.82-0.61-1.77-1.05-2.78-1.29c-1.33-0.32-2.7-0.22-3.99,0.28 c-0.93,0.36-1.78,0.93-2.5,1.66l-0.42,0.42c-0.2,0.2-0.2,0.51,0,0.71l0.71,0.71c0.2,0.2,0.51,0.2,0.71,0l0.42-0.42 c0.59-0.59,1.29-1.05,2.06-1.35c1.02-0.4,2.11-0.48,3.16-0.21c0.8,0.2,1.55,0.58,2.2,1.1c0.66,0.52,1.21,1.18,1.61,1.94 c0.5,0.94,0.76,2.01,0.72,3.08c-0.07,1.43-0.59,2.81-1.5,3.95c-0.56,0.7-1.23,1.3-1.98,1.78c-0.96,0.61-2.03,0.98-3.13,1.07 c-0.75,0.06-1.5-0.03-2.22-0.26c-0.91-0.29-1.75-0.8-2.45-1.48l-0.42-0.42c-0.2-0.2-0.51-0.2-0.71,0l-0.71,0.71 c-0.2,0.2-0.2,0.51,0,0.71l0.42,0.42c0.85,0.85,1.87,1.5,2.98,1.91c1.47,0.54,3.06,0.7,4.61,0.45c1.32-0.21,2.58-0.78,3.67-1.65 c1.09-0.87,1.97-2.03,2.55-3.36C21.57,12.19,21.55,10.16,20.62,8.35z" />
          </svg>
          <span className="font-bold text-xl tracking-tight">Breast Cancer AI System</span>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          <NavLink onClick={() => onNavigate(user ? 'dashboard' : 'home')} isActive={currentPage === 'home' || currentPage === 'dashboard'}>
            {user ? 'Dashboard' : 'Home'}
          </NavLink>
          
          {user ? (
            <>
              <NavLink onClick={() => onNavigate('contact')} isActive={currentPage === 'contact'}>Contact</NavLink>
              <button onClick={onLogout} className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleAuthNav('register')} className="hover:text-pink-200 transition-colors text-pink-100">Register</button>
              <button onClick={() => handleAuthNav('login')} className="hover:text-pink-200 transition-colors text-pink-100">Login</button>
              <NavLink onClick={() => onNavigate('contact')} isActive={currentPage === 'contact'}>Contact</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;