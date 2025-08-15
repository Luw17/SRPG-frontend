import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormDefault from '../../components/form-default/form-default';
import './login.css';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://26.141.69.7:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const fakeToken = data?.token || 'logged_in';
        localStorage.setItem('token', fakeToken);
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        console.log('Login response:', data);
        setIsLoggedIn(true);
        navigate('/home');
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        alert(error.message || 'Erro ao logar');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      alert('Erro de rede ou servidor. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="login-container">
      <FormDefault title="Login" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </FormDefault>
    </div>
  );
};

export default Login;
