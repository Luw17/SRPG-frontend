import React, { useState, useEffect } from 'react';
import FormDefault from '../../components/form-default/form-default';
import './edit-magic.css';

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

interface EditMagicModalProps {
  magic: Magic | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const EditMagicModal: React.FC<EditMagicModalProps> = ({ magic, isOpen, onClose, onSaved }) => {
  const [formData, setFormData] = useState<Partial<Magic>>({});

  useEffect(() => {
    if (magic) {
      setFormData(magic);
    }
  }, [magic]);

  if (!isOpen || !magic) return null;

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://26.141.69.7:3001/magic/update-magic/${magic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao atualizar magia');

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar magia');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <FormDefault onSubmit={handleSubmit} title={`Editar Magia: ${formData.name}`}>
          {/* Nome */}
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={formData.name || ''}
            onChange={handleFormChange}
          />

          {/* Descrição */}
          <textarea
            name="description"
            placeholder="Descrição"
            value={formData.description || ''}
            onChange={handleFormChange}
          />

          {/* Nível */}
          <select
            name="level"
            value={formData.level || ''}
            onChange={handleFormChange}
          >
            <option value="">Selecione o nível</option>
            <option value="Truque">Truque</option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                {i + 1}
              </option>
            ))}
          </select>

          {/* Alcance */}
          <input
            type="text"
            name="range"
            placeholder="Alcance"
            value={formData.range || ''}
            onChange={handleFormChange}
          />

          {/* Dano */}
          <div className="damage-section">
            <h3>Danos</h3>
            {(formData.damage || []).map((d, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Qtd"
                  value={d.quantity}
                  onChange={(e) => {
                    const newDamage = [...(formData.damage || [])];
                    newDamage[index] = { ...newDamage[index], quantity: Number(e.target.value) };
                    setFormData(prev => ({ ...prev, damage: newDamage }));
                  }}
                  style={{ width: '60px' }}
                />
                <input
                  type="text"
                  placeholder="Dado (ex: d6)"
                  value={d.die}
                  onChange={(e) => {
                    const newDamage = [...(formData.damage || [])];
                    newDamage[index] = { ...newDamage[index], die: e.target.value };
                    setFormData(prev => ({ ...prev, damage: newDamage }));
                  }}
                  style={{ width: '80px' }}
                />
                <select
                  value={d.type}
                  onChange={(e) => {
                    const newDamage = [...(formData.damage || [])];
                    newDamage[index] = { ...newDamage[index], type: e.target.value };
                    setFormData(prev => ({ ...prev, damage: newDamage }));
                  }}
                >
                  <option value="">Tipo</option>
                  <option value="ácido">Ácido</option>
                  <option value="frio">Frio</option>
                  <option value="fogo">Fogo</option>
                  <option value="força">Força</option>
                  <option value="elétrico">Elétrico</option>
                  <option value="necrótico">Necrótico</option>
                  <option value="radiante">Radiante</option>
                  <option value="veneno">Veneno</option>
                  <option value="psíquico">Psíquico</option>
                  <option value="corte">Corte</option>
                  <option value="concussão">Concussão</option>
                  <option value="perfuração">Perfuração</option>
                  <option value="energia">Energia</option>
                  <option value="cura">Cura</option>
                  <option value="variável">Variável</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    const newDamage = [...(formData.damage || [])];
                    newDamage.splice(index, 1);
                    setFormData(prev => ({ ...prev, damage: newDamage }));
                  }}
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  damage: [...(prev.damage || []), { quantity: 0, die: '', type: '' }],
                }));
              }}
            >
              + Adicionar Dano
            </button>
          </div>

          {/* Checkbox addSpellMod */}
          <label style={{ display: 'block', marginTop: '1rem' }}>
            <input
              type="checkbox"
              name="addSpellMod"
              checked={formData.addSpellMod || false}
              onChange={handleFormChange}
            />
            Incluir bônus de magia
          </label>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </FormDefault>
      </div>
    </div>
  );
};

export default EditMagicModal;
