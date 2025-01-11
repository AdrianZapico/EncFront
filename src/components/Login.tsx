import React, { useState } from 'react';

interface LoginProps {
  onLogin: (token: string, username: string) => void;
  onToggleForm: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();

    if (response.ok) {
      onLogin(data.token, data.username); // Passar o username junto com o token
    } else {
      alert(`Login failed: ${data.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded-lg mb-4"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded-lg mb-4"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Ainda não registrado?{' '}
          <a href="#" className="text-blue-500 hover:underline" onClick={onToggleForm}>
            Registre-se aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
