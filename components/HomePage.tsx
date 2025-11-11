import React from 'react';

interface HomePageProps {
    onNavigateToLogin: () => void;
    onNavigateToRegister: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <div className="flex-grow flex justify-center items-center p-4">
      <div className="max-w-2xl w-full bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-pink-700 mb-4">
            Welcome to Breast Cancer Detection System
        </h1>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Experience AI-powered diagnostic support with Explainable AI (Grad-CAM). Upload mammogram scans and visualize how the model interprets the image.
        </p>
        <div className="flex justify-center items-center space-x-4">
            <button 
                onClick={onNavigateToRegister}
                className="bg-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-700 transition-transform transform hover:scale-105"
            >
                Create Account
            </button>
            <button 
                onClick={onNavigateToLogin}
                className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
            >
                Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;