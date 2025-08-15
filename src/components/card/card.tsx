import React from 'react';
import './card.css';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="card">
    <div className="card-content">{children}</div>
  </div>
);
