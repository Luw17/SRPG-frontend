import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DiceRoller from '../dice-roller/dice-roller';
import './sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarWidth = 220;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleGoBack = () => navigate(-1);

  return (
    <>
      {/* Botão de abrir/fechar sidebar */}
      <button
        className="sidebar-toggle"
        style={{ left: isOpen ? sidebarWidth : 20 }}
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Botão do Dice Roller */}
      <button
        className="sidebar-dice"
        style={{ left: isOpen ? sidebarWidth : 20 }}
        onClick={() => setDiceOpen(true)}
      >
        <img 
          src="d20.webp" 
          alt="D20" 
          style={{ width: '24px', height: '24px' }}
        />
      </button>

      {/* Botão de voltar */}
      <button
        className="sidebar-back"
        style={{ left: isOpen ? sidebarWidth : 20 }}
        onClick={handleGoBack}
      >
        ⬅
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2>SRPG</h2>
        <nav>
          <ul>
            <li>
              <Link to="/home" onClick={toggleSidebar}>Home</Link>
            </li>
            <li>
              <Link to="/add-magic" onClick={toggleSidebar}>Adicionar Magia</Link>
            </li>
            <li>
              <Link to="/view-magic" onClick={toggleSidebar}>Ver Magias</Link>
            </li>
            <li>
              <Link to="/add-item" onClick={toggleSidebar}>Adicionar Item</Link>
            </li>
            <li>
              <Link to="/character-sheet" onClick={toggleSidebar}>Ficha do Personagem</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      {diceOpen && <DiceRoller onClose={() => setDiceOpen(false)} />}
    </>
  );
}
