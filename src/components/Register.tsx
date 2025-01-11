import React, { useState } from 'react';

interface RegisterProps {
  onToggleForm: () => void;
}

const Register: React.FC<RegisterProps> = ({ onToggleForm }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, username, password, email })
    });
    const data = await response.json();

    if (response.ok) { // Usando response.ok para verificar se a resposta foi bem-sucedida
      alert('Registro bem-sucedido! Redirecionando para o login.');
      onToggleForm(); // Redirecionando para a página de login
    } else {
      alert(`Falha no registro: ${data.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded-lg mb-4"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 border rounded-lg mb-4"
            required
          />
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
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Já possui registro?{' '}
          <a href="#" className="text-blue-500 hover:underline" onClick={onToggleForm}>
            Logue aqui
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
