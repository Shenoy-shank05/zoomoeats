import React, { useContext } from 'react';
import ThemeContext from '../context/ThemeContext';

const ProfilePage = () => {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <div className="profile-page">
      {/* ...existing profile page content... */}
      
      <button onClick={toggleTheme} className="theme-toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

export default ProfilePage;