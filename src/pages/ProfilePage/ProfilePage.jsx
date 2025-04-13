import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          STOCK Linqed
        </div>
        <div className="navbar-links">
        <span className="nav-link" onClick={() => navigate('/home')}>
            Home
          </span>  
          <span className="nav-link" onClick={() => navigate('/chat')}>
            Chat
          </span>
        </div>
      </nav>

      {/* PROFILE CONTAINER */}
      <div className="profile-container">
        {/* Profile Header */}
        <header className="profile-header">
          <img
            src="/path/to/profile-image.jpg"
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h1 className="profile-name">John Doe</h1>
            <p className="profile-username">@johndoe</p>
            <p className="profile-bio">
              Welcome to my profile! I share insights about the market, tech updates, and more.
            </p>
            <button className="follow-btn">Follow</button>
          </div>
        </header>

        {/* Profile Content */}
        <section className="profile-content">
          <h2>My Posts</h2>
          <div className="posts-grid">
            <div className="post-card">
              <h3>Post Title 1</h3>
              <p>Brief summary of post content goes here...</p>
            </div>
            <div className="post-card">
              <h3>Post Title 2</h3>
              <p>Brief summary of post content goes here...</p>
            </div>
            <div className="post-card">
              <h3>Post Title 3</h3>
              <p>Brief summary of post content goes here...</p>
            </div>
            {/* Additional post cards can be added here */}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
