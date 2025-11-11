
import React, { useState } from 'react';
import { universities } from '../constants';
import { User } from '../types';
import { CloseIcon } from './IconComponents';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onLogin: (credentials: { email: string; pass: string }) => void;
  onSignUp: (details: Omit<User, 'id'>) => void;
}

const commonInputClasses = "bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3 transition";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1";

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onLogin, onSignUp }) => {
  const [isLoginView, setIsLoginView] = useState(mode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityName, setUniversityName] = useState(universities[0]?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin({ email, pass: password });
    } else {
      onSignUp({ name, email, universityName, password });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-blue-900 rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-95 hover:scale-100">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-blue-200">
          <CloseIcon className="h-6 w-6" />
        </button>

        <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-blue-200 mb-2">
                {isLoginView ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-center text-gray-500 dark:text-blue-400 mb-8">
                {isLoginView ? 'Login to continue to CampusConnect NG' : 'Join the largest student marketplace'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLoginView && (
                    <div>
                        <label htmlFor="name" className={labelClasses}>Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={commonInputClasses} required />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className={labelClasses}>Email Address</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className={commonInputClasses} required />
                </div>
                 <div>
                    <label htmlFor="password" className={labelClasses}>Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className={commonInputClasses} required />
                </div>

                {!isLoginView && (
                    <div>
                        <label htmlFor="university" className={labelClasses}>Your University</label>
                        <select id="university" value={universityName} onChange={e => setUniversityName(e.target.value)} className={commonInputClasses} required>
                            {universities.map(uni => <option key={uni.name} value={uni.name}>{uni.name}</option>)}
                        </select>
                    </div>
                )}
                
                <button type="submit" className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                    {isLoginView ? 'Login' : 'Sign Up'}
                </button>
            </form>
            
            <p className="text-center text-sm text-gray-500 dark:text-blue-400 mt-6">
                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-indigo-600 hover:underline ml-1">
                    {isLoginView ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
