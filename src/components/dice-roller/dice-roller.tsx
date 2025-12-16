import React, { useState, useEffect } from 'react';
import './dice-roller.css';

interface Dice {
  type: number;
  quantity: number;
}

interface Modifiers {
  [key: string]: number;
}

interface RollResult {
  diceResults: { type: number; rolls: number[]; quantity: number }[];
  appliedMods: { name: string; value: number }[];
  manualBonus: number;
  total: number;
}

export default function DiceRoller({ onClose }: { onClose: () => void }) {
  const [dice, setDice] = useState<Dice[]>([]);
  const [manualBonus, setManualBonus] = useState(0);
  
  // Modificadores
  const [mods, setMods] = useState<Modifiers>({});
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  
  // Resultado
  const [lastResult, setLastResult] = useState<RollResult | null>(null);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  // Carregar do LocalStorage
  const loadMods = () => {
    const saved = localStorage.getItem('srpg_modifiers');
    if (saved) {
      try {
        setMods(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  };

  useEffect(() => {
    loadMods();
    window.addEventListener('modifiersUpdated', loadMods);
    return () => { window.removeEventListener('modifiersUpdated', loadMods); };
  }, []);

  // Adicionar/Remover dados
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

  // --- Lógica do Checkbox ---
  const handleCheckboxChange = (key: string) => {
    if (selectedMods.includes(key)) {
      setSelectedMods(prev => prev.filter(m => m !== key));
    } else {
      setSelectedMods(prev => [...prev, key]);
    }
  };

  const rollDice = () => {
    // 1. Dados
    const newDiceResults: { type: number; rolls: number[]; quantity: number }[] = [];
    let diceSum = 0;

    dice.forEach(d => {
      const rolls: number[] = [];
      for (let i = 0; i < d.quantity; i++) {
        const val = Math.floor(Math.random() * d.type) + 1;
        rolls.push(val);
        diceSum += val;
      }
      newDiceResults.push({ type: d.type, rolls, quantity: d.quantity });
    });

    // 2. Apenas os Mods Selecionados (Checked)
    const appliedModsSnapshot = selectedMods.map(key => ({
      name: key,
      value: mods[key] || 0
    }));

    const modsSum = appliedModsSnapshot.reduce((acc, curr) => acc + curr.value, 0);

    // 3. Resultado Final
    setLastResult({
      diceResults: newDiceResults,
      appliedMods: appliedModsSnapshot,
      manualBonus: manualBonus,
      total: diceSum + manualBonus + modsSum
    });
  };

  return (
    <div className="dice-modal-overlay">
      <div className="dice-modal">
        <div className="modal-header">
          <h2>Rolador</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Botões de Dados */}
        <div className="dice-types">
          {diceTypes.map(type => (
            <button key={type} onClick={() => addDice(type)}>d{type}</button>
          ))}
        </div>

        {/* Lista de Dados Selecionados */}
        <div className="selected-dice">
          {dice.length === 0 && <p className="empty-msg">Nenhum dado selecionado</p>}
          {dice.map(d => (
            <div key={d.type} className="dice-row">
              <span className="dice-label">d{d.type}</span>
              <input
                type="number"
                min={1}
                value={d.quantity}
                onChange={e => updateQuantity(d.type, Number(e.target.value))}
              />
              <button className="btn-remove" onClick={() => removeDice(d.type)}>Remover</button>
            </div>
          ))}
        </div>

        <hr />

        {/* CHECKBOXES DE ATRIBUTOS */}
        <div className="mods-section">
          <label className="section-title">Aplicar Atributos:</label>
          <div className="mods-list-checkboxes">
            {Object.entries(mods).map(([key, val]) => (
              <label key={key} className="mod-checkbox-label">
                <input 
                  type="checkbox"
                  checked={selectedMods.includes(key)}
                  onChange={() => handleCheckboxChange(key)}
                />
                <span className="mod-text">
                  {key} ({val >= 0 ? `+${val}` : val})
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Bônus Manual */}
        <div className="bonus-row">
          <label>Bônus Extra:</label>
          <input
            type="number"
            value={manualBonus}
            onChange={e => setManualBonus(Number(e.target.value))}
          />
        </div>

        <button className="roll-btn" onClick={rollDice}>Rolar Agora</button>

        {/* Resultados */}
        {lastResult && (
          <div className="results">
            <h3>Total: <span className="final-total">{lastResult.total}</span></h3>
            
            <div className="results-details">
              {lastResult.diceResults.map(r => (
                <p key={r.type}>
                  {r.quantity}d{r.type}: [{r.rolls.join(', ')}]
                </p>
              ))}

              {lastResult.appliedMods.length > 0 && (
                <div className="applied-mods-display">
                  {lastResult.appliedMods.map((mod, idx) => (
                    <p key={idx} style={{ color: '#aaa', margin: '2px 0' }}>
                      Bônus de {mod.name}: <strong>{mod.value >= 0 ? `+${mod.value}` : mod.value}</strong>
                    </p>
                  ))}
                </div>
              )}

              {lastResult.manualBonus !== 0 && (
                <p>Extra: {lastResult.manualBonus}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}