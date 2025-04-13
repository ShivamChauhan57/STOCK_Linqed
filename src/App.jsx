import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
// import ChatPage from './pages/ChatPage/ChatPage';       // Your ChatPage component
import ProfilePage from './pages/ProfilePage/ProfilePage'; // Your ProfilePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/chat" element={<ChatPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
