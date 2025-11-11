import React, { useState } from 'react';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  view: 'login' | 'register';
  setView: (view: 'login' | 'register') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, view, setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'radiologist@health.com' && password === 'password123') {
      setError('');
      onLogin({ name: 'Dr. Radiologist', email: 'radiologist@health.com', specialization: 'Radiology' });
    } else {
      setError('Invalid credentials. Hint: radiologist@health.com / password123');
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (fullName.trim() && email.trim() && specialization.trim()) {
       setError('');
       onLogin({ name: fullName, email, specialization });
    } else {
        setError('Please fill out all fields.');
    }
  };
  
  const renderLogin = () => (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">Radiologist Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors mt-6">
          Login
        </button>
        <p className="text-center text-sm text-gray-500 pt-2">
            Don't have an account?{' '}
            <button type="button" onClick={() => setView('register')} className="font-semibold text-pink-600 hover:underline">
                Register here
            </button>
        </p>
      </form>
    </div>
  );
  
  const renderRegister = () => (
     <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-700">Register as Radiologist</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="sr-only">Full Name</label>
          <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        <div>
           <label htmlFor="email" className="sr-only">Email</label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        <div>
          <label htmlFor="createPassword" className="sr-only">Create Password</label>
          <input type="password" id="createPassword" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create Password" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        <div>
          <label htmlFor="specialization" className="sr-only">Specialization</label>
          <input type="text" id="specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Specialization" className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" required/>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-700 transition-colors mt-6">
          Register
        </button>
         <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{' '}
            <button type="button" onClick={() => setView('login')} className="font-semibold text-pink-600 hover:underline">
                Login here
            </button>
        </p>
      </form>
    </div>
  );

  return (
    <div className="flex-grow flex justify-center items-center p-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-xl shadow-lg">
        {view === 'login' ? renderLogin() : renderRegister()}
      </div>
    </div>
  );
};

export default LoginPage;