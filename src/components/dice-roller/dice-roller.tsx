import React, { useState } from 'react';
import './dice-roller.css';

interface Dice {
  type: number;
  quantity: number;
}

export default function DiceRoller({ onClose }: { onClose: () => void }) {
  const [dice, setDice] = useState<Dice[]>([]);
  const [bonus, setBonus] = useState(0);
  const [results, setResults] = useState<{ type: number; rolls: number[]; quantity: number }[]>([]);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const addDice = (type: number) => {
    setDice(prev => {
      const exists = prev.find(d => d.type === type);
      if (exists) return prev.map(d => d.type === type ? { ...d, quantity: d.quantity + 1 } : d);
      return [...prev, { type, quantity: 1 }];
    });
  };

  const removeDice = (type: number) => {
    setDice(prev => prev.filter(d => d.type !== type));
  };

  const updateQuantity = (type: number, qty: number) => {
    setDice(prev => prev.map(d => d.type === type ? { ...d, quantity: qty } : d));
  };

  const rollDice = () => {
    const newResults: { type: number; rolls: number[]; quantity: number }[] = [];

    dice.forEach(d => {
      const rolls: number[] = [];
      for (let i = 0; i < d.quantity; i++) {
        rolls.push(Math.floor(Math.random() * d.type) + 1);
      }
      newResults.push({ type: d.type, rolls, quantity: d.quantity });
    });

    setResults(newResults);
  };

  const total = results.reduce(
    (acc, r) => acc + r.rolls.reduce((a, b) => a + b, 0),
    0
  ) + bonus;

  return (
    <div className="dice-modal-overlay">
      <div className="dice-modal">
        <h2>Rolador de Dados</h2>
        <button className="close-btn" onClick={onClose}>✖</button>

        <div className="dice-types">
          {diceTypes.map(type => (
            <button key={type} onClick={() => addDice(type)}>d{type}</button>
          ))}
        </div>

        <div className="selected-dice">
          {dice.map(d => (
            <div key={d.type} className="dice-row">
              <span>d{d.type}</span>
              <input
                type="number"
                min={1}
                value={d.quantity}
                onChange={e => updateQuantity(d.type, Number(e.target.value))}
              />
              <button onClick={() => removeDice(d.type)}>Remover</button>
            </div>
          ))}
        </div>

        <div className="bonus-row">
          <label>Bônus/Malus:</label>
          <input
            type="number"
            value={bonus}
            onChange={e => setBonus(Number(e.target.value))}
          />
        </div>

        <button className="roll-btn" onClick={rollDice}>Rolar Dados</button>

        {results.length > 0 && (
          <div className="results">
            <h3>Resultados:</h3>
            {results.map(r => (
              <p key={r.type}>
                [{r.rolls.join(', ')}] {r.quantity}d{r.type}
              </p>
            ))}
            {bonus !== 0 && <p>Bônus aplicado: {bonus}</p>}
            <p><strong>Total: {total}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
