import React, { useState, useEffect } from 'react';
import type { PatientCase, User } from './types';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { getCases, saveCases } from './services/dbService';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import HomePage from './components/HomePage';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cases, setCases] = useState<PatientCase[]>(() => getCases());
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'dashboard' | 'contact'>('home');

  useEffect(() => {
    saveCases(cases);
  }, [cases]);
  
  useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('home');
    }
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
    setCurrentPage('home');
  };
  
  const renderPage = () => {
    if (!user) {
        switch (currentPage) {
            case 'auth':
                return <LoginPage onLogin={handleLogin} view={authView} setView={setAuthView} />;
            case 'contact':
                return <ContactPage />;
            case 'home':
            default:
                return <HomePage 
                    onNavigateToLogin={() => { setAuthView('login'); setCurrentPage('auth'); }}
                    onNavigateToRegister={() => { setAuthView('register'); setCurrentPage('auth'); }}
                />;
        }
    }
    
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} cases={cases} setCases={setCases} onLogout={handleLogout} />;
      case 'contact':
        return <ContactPage />;
      default:
         return <Dashboard user={user} cases={cases} setCases={setCases} onLogout={handleLogout} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gradient-to-br from-pink-50 to-rose-100">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onAuthNavigate={!user ? setAuthView : undefined}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <main className="flex-grow flex flex-col">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;