import  { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';

function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  const handleLogin = (token: string, username: string) => {
    setToken(token);
    setUsername(username);
  };

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  if (!token) {
    return (
      <div>
        {showLogin ? (
          <Login onLogin={handleLogin} onToggleForm={toggleForm} />
        ) : (
          <Register onToggleForm={toggleForm} />
        )}
      </div>
    );
  }

  return (
    <ChatRoom username={username} />
  );
}

export default App;
