import React from 'react';
import './home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="homepage-container">      
      <h1 className="homepage-title">Bem-vindo ao Sistema de RPG</h1>
      <p className="homepage-subtitle">Gerencie suas fichas, campanhas e personagens.</p>

      <div className="homepage-actions">
        <Link to="/add-magic">
          <button className="homepage-button">Adicionar Magia</button>
        </Link>
        <Link to="/view-magic">
          <button className="homepage-button">Ver Magias</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
