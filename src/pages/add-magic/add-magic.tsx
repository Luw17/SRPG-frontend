import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormDefault from '../../components/form-default/form-default';
import './add-magic.css';

const AddMagic: React.FC = () => {
  const navigate = useNavigate();
  const [damageDice, setDamageDice] = useState([
    { quantity: 1, die: 'd6', type: '' }
  ]);
  const [addSpellMod, setAddSpellMod] = useState(false);
  const [isTouchRange, setIsTouchRange] = useState(false);
  const [rangeValue, setRangeValue] = useState('');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Pega o estado da checkbox pela formData
    const isTouchRangeChecked = formData.get("isTouchRange") === "on";
    const rangeInputValue = formData.get("rangeInput") as string;

    // Define o valor do range conforme o checkbox
    const range = isTouchRangeChecked ? "Toque" : (rangeInputValue || "");

    const name = formData.get("name") as string;
    const level = formData.get("level") as string;
    const description = formData.get("description") as string;
    const addSpellModValue = formData.get("addSpellMod") === "on";

    // Construção do array damage
    const damage: { quantity: number; die: string; type: string }[] = [];
    const quantityList = formData.getAll("damage_quantity");
    const dieList = formData.getAll("damage_die");
    const typeList = formData.getAll("damage_type");

    for (let i = 0; i < quantityList.length; i++) {
      damage.push({
        quantity: parseInt(quantityList[i] as string),
        die: dieList[i] as string,
        type: typeList[i] as string,
      });
    }

    // Monta o payload para enviar ao backend
    const payload = {
      name,
      level,
      range,
      description,
      damage,
      addSpellMod: addSpellModValue,
    };

    try {
      const response = await fetch("http://26.141.69.7:3001/magic/add-magic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar magia");
      }

      const result = await response.json();
      console.log("Magia criada com sucesso:", result);
      alert("Magia adicionada com sucesso!");
    

    } catch (error) {
      console.error("Erro ao enviar magia:", error);
    }
  };

  const handleDamageChange = (index: number, key: string, value: string | number) => {
    const updated = [...damageDice];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setDamageDice(updated);
  };

  const addDamageEntry = () => {
    setDamageDice([...damageDice, { quantity: 1, die: 'd6', type: '' }]);
  };

  const removeDamageEntry = (index: number) => {
    const updated = [...damageDice];
    updated.splice(index, 1);
    setDamageDice(updated);
  };

  return (
    <div className="add-magic-container">
      <FormDefault title="Adicionar Magia" onSubmit={handleSubmit}>
        <label>
          Nome da Magia:
          <input type="text" name="name" required />
        </label>

        <label>
          Nível da Magia:
          <select name="level" required>
            <option value="Truque">Truque</option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
          <label style={{ flexGrow: 1 }}>
            Alcance da Magia:
            <input
              type="number"
              name="rangeInput"
              value={rangeValue}
              onChange={(e) => setRangeValue(e.target.value)}
              required={!isTouchRange}
              disabled={isTouchRange}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'auto' }}>
            <input
              type="checkbox"
              name="isTouchRange"
              checked={isTouchRange}
              onChange={(e) => {
                setIsTouchRange(e.target.checked);
                if (e.target.checked) {
                  setRangeValue('Toque');
                } else {
                  setRangeValue('');
                }
              }}
            />
            Toque
          </label>
        </div>

        <label>
          Descrição da Magia:
          <textarea name="description" required />
        </label>

        <fieldset>
          <legend>Dados de Dano</legend>

          {damageDice.map((entry, index) => (
            <div key={index} style={{ marginBottom: '8px' }}>
              <input
                type="number"
                name="damage_quantity"
                value={entry.quantity}
                min={1}
                onChange={(e) => handleDamageChange(index, 'quantity', parseInt(e.target.value))}
                placeholder="Qtd"
                style={{ width: '60px', marginRight: '8px' }}
              />

              <select
                name="damage_die"
                value={entry.die}
                onChange={(e) => handleDamageChange(index, 'die', e.target.value)}
              >
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d8">d8</option>
                <option value="d10">d10</option>
                <option value="d12">d12</option>
                <option value="d20">d20</option>
              </select>

              <select
                name="damage_type"
                value={entry.type}
                onChange={(e) => handleDamageChange(index, 'type', e.target.value)}
                style={{ marginLeft: '8px' }}
              >
                <option value="">Tipo de Dano</option>
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

              <button type="button" onClick={() => removeDamageEntry(index)}>
                Remover
              </button>
            </div>
          ))}

          <button type="button" onClick={addDamageEntry}>Adicionar Dado de Dano</button>

          <label style={{ display: 'block', marginTop: '10px' }}>
            <input
              type="checkbox"
              name="addSpellMod"
              checked={addSpellMod}
              onChange={(e) => setAddSpellMod(e.target.checked)}
            />
            Incluir bônus de magia (mod. de atributo)
          </label>
        </fieldset>

        <button type="submit">Adicionar</button>
      </FormDefault>

      <button onClick={handleGoBack} className="back-button">Voltar</button>
    </div>
  );
};

export default AddMagic;
