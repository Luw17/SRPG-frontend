import React, { useEffect, useState, useRef } from 'react';
import { Card } from '../../components/card/card';
import { useNavigate } from 'react-router-dom';
import './view-magic.css';

interface Damage {
  quantity: number;
  die: string;
  type: string;
}

interface Magic {
  _id: string;
  name: string;
  description: string;
  level: string;
  range: string;
  damage: Damage[];
  addSpellMod: boolean;
}

const ViewMagic: React.FC = () => {
  const navigate = useNavigate();
  const [magias, setMagias] = useState<Magic[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterName, setFilterName] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const fetchMagias = async (name: string, level: string, type: string) => {
    setLoading(true);
    try {
      let url = '';
      const hasFilter = name || level || type;

      if (hasFilter) {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        if (level) params.append('level', level);
        if (type) params.append('type', type);

        url = `http://26.141.69.7:3001/magic/filter-magic?${params.toString()}`;
      } else {
        url = 'http://26.141.69.7:3001/magic/get-all-magic';
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro ao buscar magias: ${res.status}`);
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
    fetchMagias(filterName, filterLevel, filterType);
  }, [filterLevel, filterType]);
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchMagias(filterName, filterLevel, filterType);
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [filterName]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="view-magic-page">
      <h1>Lista de Magias</h1>

      {}
      <div
        className="filters"
        style={{
          marginBottom: '1rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="text"
          placeholder="Buscar por nome"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ flex: '1 1 200px' }}
        />

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          style={{ flex: '1 1 150px' }}
        >
          <option value="">Todos os níveis</option>
          <option value="Truque">Truque</option>
          {[...Array(9)].map((_, i) => (
            <option key={i + 1} value={(i + 1).toString()}>
              {i + 1}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ flex: '1 1 180px' }}
        >
          <option value="">Todos os tipos de dano</option>
          <option value="ácido">Ácido</option>
          <option value="frio">Frio</option>
          <option value="fogo">Fogo</option>
          <option value="força">Força</option>
          <option value="elétrico">Elétrico</option>
          <option value="necromante">Necromante</option>
          <option value="radiante">Radiante</option>
          <option value="veneno">Veneno</option>
          <option value="psíquico">Psíquico</option>
          <option value="corte">Corte</option>
          <option value="concussão">Concussão</option>
          <option value="perfuração">Perfuração</option>
        </select>
      </div>

      {}
      {loading ? (
        <p>Carregando magias...</p>
      ) : magias.length === 0 ? (
        <>
          <p>Nenhuma magia encontrada.</p>
        </>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
        >
          {magias.map((magic) => (
            <Card key={magic._id}>
              <h2>{magic.name}</h2>
              <p>
                <strong>Nível:</strong> {magic.level}
              </p>
              <p>
                <strong>Alcance:</strong> {magic.range}
              </p>
              <p>
                <strong>Descrição:</strong> {magic.description}
              </p>

              {magic.damage.length > 0 && (
                <p>
                  <strong>Dano:</strong>{' '}
                  {magic.damage
                    .map((d) => `${d.quantity} ${d.die} ${d.type}`.trim())
                    .join(', ')}
                </p>
              )}

              {magic.addSpellMod && (
                <p>
                  <em>Inclui bônus de magia (modificador de atributo)</em>
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <button
        onClick={handleGoBack}
        className="back-button"
        style={{ marginTop: '1rem' }}
      >
        Voltar
      </button>
    </div>
  );
};

export default ViewMagic;
