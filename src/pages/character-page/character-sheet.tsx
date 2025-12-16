import React, { useState, useEffect, useRef } from 'react';
import FormDefault from '../../components/form-default/form-default';
import './character-sheet.css';
// --- Interfaces ---
interface Damage {
  quantity: number;
  die: string;
  type: string;
}

interface Magic {
  _id?: string;
  originalId?: string;
  name: string;
  description: string;
  level: string;
  range: string;
  damage: Damage[];
  addSpellMod: boolean;
}

// --- Componente: Aba de Busca de Magias ---
const SpellSearchTab: React.FC<{ onSelect: (spell: Magic) => void }> = ({ onSelect }) => {
  const [magias, setMagias] = useState<Magic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchMagias = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterName) params.append('name', filterName);
      if (filterLevel) params.append('level', filterLevel);
      if (filterType) params.append('type', filterType);

      const url = filterName || filterLevel || filterType
        ? `http://26.141.69.7:3001/magic/filter-magic?${params.toString()}`
        : 'http://26.141.69.7:3001/magic/get-all-magic';

      const res = await fetch(url);
      if (!res.ok) throw new Error('Erro ao buscar magias');
      const data = await res.json();
      setMagias(data);
    } catch (error) {
      console.error(error);
      setMagias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(fetchMagias, 500);
    return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [filterName, filterLevel, filterType]);

  return (
    <div>
      <div className="filter-bar">
        <input placeholder="Nome..." value={filterName} onChange={e => setFilterName(e.target.value)} style={{ flex: 1 }} />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
          <option value="">Nível</option>
          <option value="Truque">Truque</option>
          {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Tipo</option>
          {['ácido', 'fogo', 'frio', 'elétrico', 'necrótico', 'radiante', 'corte'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {loading ? <p>Carregando...</p> : (
        <div className="search-grid">
          {magias.map(m => (
            <div key={m._id} className="search-card">
              <div>
                <h4>{m.name}</h4>
                <p><strong>Nível:</strong> {m.level}</p>
              </div>
              <button className="btn-select" onClick={() => onSelect(m)}>+ Adicionar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Componente: Aba de Criação de Magia ---
const SpellCreateTab: React.FC<{ onCreated: (spell: Magic) => void }> = ({ onCreated }) => {
  const [damageDice, setDamageDice] = useState([{ quantity: 1, die: 'd6', type: '' }]);
  const [addSpellMod, setAddSpellMod] = useState(false);
  const [isTouchRange, setIsTouchRange] = useState(false);
  const [rangeValue, setRangeValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const damage: Damage[] = [];
    const qList = formData.getAll("damage_quantity");
    const dList = formData.getAll("damage_die");
    const tList = formData.getAll("damage_type");
    
    qList.forEach((_, i) => {
      damage.push({ 
        quantity: parseInt(qList[i] as string), 
        die: dList[i] as string, 
        type: tList[i] as string 
      });
    });

    const payload: Magic = {
      name: formData.get("name") as string,
      level: formData.get("level") as string,
      range: isTouchRange ? "Toque" : (formData.get("rangeInput") as string),
      description: formData.get("description") as string,
      damage,
      addSpellMod: formData.get("addSpellMod") === "on"
    };

    try {
        const res = await fetch("http://26.141.69.7:3001/magic/add-magic", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Erro");
        const saved = await res.json();
        onCreated(saved);
    } catch (e) { console.error(e); }
  };

  const updateDamage = (idx: number, field: string, val: any) => {
    const copy = [...damageDice];
    // @ts-ignore
    copy[idx][field] = val;
    setDamageDice(copy);
  };

  return (
    <FormDefault title="" onSubmit={handleSubmit}>
      <label>Nome: <input name="name" required /></label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <label style={{ flex: 1 }}>Nível: 
          <select name="level" required>
            <option value="Truque">Truque</option>
            {[...Array(9)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
        </label>
        <label style={{ flex: 2 }}>Alcance: 
          <div style={{ display: 'flex', gap: '5px' }}>
            <input name="rangeInput" value={rangeValue} onChange={e=>setRangeValue(e.target.value)} disabled={isTouchRange} />
            <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
               <input type="checkbox" checked={isTouchRange} onChange={e=>{setIsTouchRange(e.target.checked); if(e.target.checked) setRangeValue('Toque')}} /> Toque
            </label>
          </div>
        </label>
      </div>
      <label>Descrição: <textarea name="description" required rows={3} /></label>
      
      <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
        <small>Dano</small>
        {damageDice.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
            <input type="number" name="damage_quantity" value={d.quantity} onChange={e=>updateDamage(i,'quantity',e.target.value)} style={{ width: '40px' }} />
            <select name="damage_die" value={d.die} onChange={e=>updateDamage(i,'die',e.target.value)}>
               {['d4','d6','d8','d10','d12','d20'].map(die=><option key={die} value={die}>{die}</option>)}
            </select>
            <select name="damage_type" value={d.type} onChange={e=>updateDamage(i,'type',e.target.value)}>
               <option value="">Tipo</option>
               {['fogo','gelo','corte','perfuracao','acido'].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
        <button type="button" onClick={()=>setDamageDice([...damageDice, {quantity:1, die:'d6', type:''}])} style={{ fontSize: '0.8rem' }}>+ Dado</button>
      </div>
      
      <label><input type="checkbox" name="addSpellMod" /> Add Modificador</label>
      <button type="submit" style={{ marginTop: '10px', width: '100%' }}>Salvar e Adicionar</button>
    </FormDefault>
  );
};

// --- Componente: Modal Gerenciador ---
const MagicManagerModal: React.FC<{ onClose: () => void, onAdd: (m: Magic) => void }> = ({ onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'create'>('search');
  return (
    <div className="modal-content">
      <button className="close-modal" onClick={onClose}>&times;</button>
      <div className="modal-tabs">
        <button className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>Buscar</button>
        <button className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>Criar</button>
      </div>
      {activeTab === 'search' ? <SpellSearchTab onSelect={(m) => { onAdd(m); onClose(); }} /> : <SpellCreateTab onCreated={(m) => { onAdd(m); onClose(); }} />}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL: CharacterSheet ---
const CharacterSheet: React.FC = () => {
  const [charId, setCharId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<'salvo' | 'salvando' | 'erro'>('salvo');

  const [charInfo, setCharInfo] = useState({ 
    name: '', 
    class: '', 
    level: '1', 
    race: '',
    proficiency: '2' 
  });

  const [stats, setStats] = useState({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  const [spells, setSpells] = useState<Magic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);

  const calculateMod = (score: number) => Math.floor((score - 10) / 2);
  const formatMod = (mod: number) => (mod >= 0 ? `+${mod}` : mod);

  // 1. Inicialização
  useEffect(() => {
    const initCharacter = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('http://26.141.69.7:3001/charactersheet');
        if (!res.ok) throw new Error('Falha ao buscar fichas');
        
        const data = await res.json();

        if (data && data.length > 0) {
          const char = data[0];
          setCharId(char._id);
          setCharInfo({ 
            name: char.name, 
            class: char.class, 
            level: char.level.toString(), 
            race: char.race,
            proficiency: char.proficiency ? char.proficiency.toString() : '2'
          });
          setStats(char.stats);
          setSpells(char.spells || []);
        } else {
          const defaultChar = {
            name: "Novo Personagem", class: "Aventureiro", level: 1, race: "Humano", proficiency: 2,
            stats: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, spells: []
          };
          const createRes = await fetch('http://26.141.69.7:3001/charactersheet', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(defaultChar)
          });
          if (!createRes.ok) throw new Error('Falha ao criar');
          const newChar = await createRes.json();
          setCharId(newChar._id);
          setCharInfo({ 
            name: newChar.name, 
            class: newChar.class, 
            level: newChar.level.toString(), 
            race: newChar.race,
            proficiency: newChar.proficiency ? newChar.proficiency.toString() : '2'
          });
          setStats(newChar.stats);
          setSpells(newChar.spells || []);
        }
      } catch (error) {
        console.error("Erro init:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initCharacter();
  }, []);

  // 2. Auto-Save e Sincronia LocalStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!charId || isLoading) return;

    setSavingStatus('salvando');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // --- ATUALIZADO: Salva Mods + PROF no cache ---
        const modifiers = {
          FOR: calculateMod(stats.str),
          DES: calculateMod(stats.dex),
          CON: calculateMod(stats.con),
          INT: calculateMod(stats.int),
          SAB: calculateMod(stats.wis),
          CAR: calculateMod(stats.cha),
          PROF: parseInt(charInfo.proficiency) || 0 // Adiciona Proficiência
        };
        
        localStorage.setItem('srpg_modifiers', JSON.stringify(modifiers));
        window.dispatchEvent(new Event('modifiersUpdated'));
        // ----------------------------------------------

        const payload = {
          name: charInfo.name,
          class: charInfo.class,
          level: parseInt(charInfo.level) || 1,
          race: charInfo.race,
          proficiency: parseInt(charInfo.proficiency) || 2,
          stats: stats,
          spells: spells
        };

        const res = await fetch(`http://26.141.69.7:3001/charactersheet/${charId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Falha ao salvar');
        setSavingStatus('salvo');

      } catch (error) {
        console.error('Erro autosave:', error);
        setSavingStatus('erro');
      }
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [charInfo, stats, spells, charId]);

  const handleStatChange = (stat: keyof typeof stats, value: string) => {
    setStats(prev => ({ ...prev, [stat]: parseInt(value) || 0 }));
  };

  if (isLoading) return <div className="sheet-container">Carregando...</div>;

  return (
    <div className="sheet-container">
       <div style={{ position: 'fixed', bottom: '10px', right: '10px', padding: '5px 10px', background: '#333', color: 'white', borderRadius: '4px', fontSize: '0.8rem', opacity: 0.8, zIndex: 999 }}>
        Status: {savingStatus === 'salvando' ? 'Salvando...' : savingStatus === 'erro' ? 'Erro' : 'Salvo'}
      </div>

      <header className="sheet-header">
        <div className="inline-field" style={{ flex: 2 }}>
            <label>Nome</label>
            <input className="sheet-input" value={charInfo.name} onChange={(e) => setCharInfo({...charInfo, name: e.target.value})} />
        </div>
        <div className="inline-field"><label>Classe</label><input className="sheet-input" value={charInfo.class} onChange={(e) => setCharInfo({...charInfo, class: e.target.value})} /></div>
        <div className="inline-field" style={{ flex: 0.5 }}><label>Nível</label><input type="number" className="sheet-input" value={charInfo.level} onChange={(e) => setCharInfo({...charInfo, level: e.target.value})} /></div>
        <div className="inline-field"><label>Raça</label><input className="sheet-input" value={charInfo.race} onChange={(e) => setCharInfo({...charInfo, race: e.target.value})} /></div>
        
        {/* Input de Proficiência */}
        <div className="inline-field" style={{ flex: 0.5 }}>
            <label>Prof.</label>
            <input 
                type="number" 
                className="sheet-input" 
                value={charInfo.proficiency} 
                onChange={(e) => setCharInfo({...charInfo, proficiency: e.target.value})} 
                style={{ textAlign: 'center', color: '#d9534f', fontWeight: 'bold' }}
            />
        </div>
      </header>

      <section className="stats-grid">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="stat-box">
            <span className="stat-label">{key.toUpperCase()}</span>
            <input 
              type="number" className="stat-input" value={value}
              onChange={(e) => handleStatChange(key as keyof typeof stats, e.target.value)}
            />
            <div className="stat-mod">{formatMod(calculateMod(value))}</div>
          </div>
        ))}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <div className="section-title">
          <span>Grimório</span>
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Gerenciar</button>
        </div>
        <div className="spells-grid">
           {spells.map((spell, idx) => (
             <div key={idx} className="spell-card">
               <div className="spell-header"><span>{spell.name}</span><strong>{spell.level}</strong></div>
               <div className="spell-detail">
                 {spell.damage?.map(d=>`${d.quantity}${d.die} ${d.type}`).join('+')}
                 {spell.addSpellMod && " + Mod"}
               </div>
               <button onClick={() => setSpells(spells.filter((_, i) => i !== idx))} style={{color:'red', border:'none', background:'none', cursor:'pointer', fontSize:'0.7rem'}}>Remover</button>
             </div>
           ))}
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay">
          <MagicManagerModal onClose={() => setIsModalOpen(false)} onAdd={(m) => setSpells([...spells, m])} />
        </div>
      )}
    </div>
  );
};

export default CharacterSheet;