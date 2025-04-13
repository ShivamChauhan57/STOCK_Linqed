import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';

function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alice', text: 'Hey, how are you?' },
    { id: 2, user: 'Bob', text: 'I’m doing great, thanks! How about you?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, user: 'You', text: input },
    ]);
    setInput('');
  };

  return (
    <div className="chat-page">
      {/* NAVIGATION BAR */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => navigate('/')}>
          STOCK Linqed
        </div>
        <div className="navbar-links">
          <span className="nav-link" onClick={() => navigate('/chat')}>
            Chat
          </span>
          <span className="nav-link" onClick={() => navigate('/profile')}>
            Profile
          </span>
        </div>
      </nav>

      {/* CHAT CONTAINER */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.user === 'You' ? 'sent' : 'received'}`}
            >
              <span className="chat-user">{msg.user}:</span>
              <span className="chat-text">{msg.text}</span>
            </div>
          ))}
        </div>
        <form className="chat-input-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="send-btn">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
