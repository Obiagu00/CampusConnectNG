
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { universities } from '../constants';
import { ProfileIcon } from './IconComponents';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedData: { name: string; universityName: string }) => void;
  onBack: () => void;
}

const commonInputClasses = "bg-gray-100 dark:bg-blue-800 border-2 border-transparent focus:bg-white dark:focus:bg-blue-900 focus:border-indigo-500 rounded-lg w-full p-3 transition";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-blue-300 mb-1";

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [universityName, setUniversityName] = useState(user.universityName);

  useEffect(() => {
    setName(user.name);
    setUniversityName(user.universityName);
  }, [user]);

  const handleSave = () => {
    onUpdateUser({ name, universityName });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setUniversityName(user.universityName);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button onClick={onBack} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Marketplace
      </button>

      <div className="bg-white dark:bg-blue-900 rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4 sm:mb-0">
            <ProfileIcon className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-grow text-center sm:text-left">
            {!isEditing ? (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            ) : (
              <div>
                <label htmlFor="name" className={labelClasses}>Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={commonInputClasses} />
              </div>
            )}
            <p className="text-lg text-gray-500 dark:text-blue-400">{user.email}</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="mt-4 sm:mt-0 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-blue-700 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-blue-200">University</h3>
            {!isEditing ? (
              <p className="text-gray-600 dark:text-blue-400">{user.universityName}</p>
            ) : (
                <div className="mt-1">
                    <select id="university" value={universityName} onChange={e => setUniversityName(e.target.value)} className={commonInputClasses} required>
                        {universities.map(uni => <option key={uni.name} value={uni.name}>{uni.name}</option>)}
                    </select>
                </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button type="button" onClick={handleSave} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                    Save Changes
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
