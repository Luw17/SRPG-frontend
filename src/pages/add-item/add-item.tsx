import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormDefault from "../../components/form-default/form-default";
import "./add-item.css";

type DamageEntry = {
  quantity: number;
  die: string;
  type: string;
};

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const [damageDice, setDamageDice] = useState<DamageEntry[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const weight = Number(formData.get("weight") || 0);
    const rarity = formData.get("rarity") as string;

    const value = {
      pp: Number(formData.get("pp") || 0),
      gp: Number(formData.get("gp") || 0),
      sp: Number(formData.get("sp") || 0),
      cp: Number(formData.get("cp") || 0),
    };

    const damage: DamageEntry[] = [];
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

    const payload = {
      name,
      type,
      description,
      weight,
      rarity,
      value,
      damage,
      image,
    };

    console.log("Item criado:", payload);
    alert("Item adicionado com sucesso!");
  };

  const handleDamageChange = (
    index: number,
    key: keyof DamageEntry,
    value: string | number
  ) => {
    const updated = [...damageDice];
    updated[index] = {
      ...updated[index],
      [key]: value,
    };
    setDamageDice(updated);
  };

  const addDamageEntry = () => {
    setDamageDice([...damageDice, { quantity: 1, die: "d6", type: "" }]);
  };

  const removeDamageEntry = (index: number) => {
    const updated = [...damageDice];
    updated.splice(index, 1);
    setDamageDice(updated);
  };

  return (
    <div className="add-item-container">
      <FormDefault title="Adicionar Item" onSubmit={handleSubmit}>
        <label>
          Nome do Item:
          <input type="text" name="name" required />
        </label>

        <label>
          Tipo:
          <select name="type" required>
            <option value="arma">Arma</option>
            <option value="armadura">Armadura</option>
            <option value="consumivel">consumivel</option>
            <option value="item mágico">Item Mágico</option>
            <option value="ferramenta">Ferramenta</option>
            <option value="diversos">Diversos</option>
            <option value="valioso">valioso</option>
            <option value="material">material</option>
            <option value="outro">Acessório</option>
          </select>
        </label>

        <label>
          Descrição:
          <textarea name="description" required />
        </label>

        <fieldset>
          <legend>Dados de Dano (opcionais)</legend>
          {damageDice.map((entry, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <input
                type="number"
                name="damage_quantity"
                value={entry.quantity}
                min={1}
                onChange={(e) =>
                  handleDamageChange(index, "quantity", parseInt(e.target.value))
                }
                placeholder="Qtd"
                style={{ width: "60px", marginRight: "8px" }}
              />

              <select
                name="damage_die"
                value={entry.die}
                onChange={(e) => handleDamageChange(index, "die", e.target.value)}
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
                onChange={(e) => handleDamageChange(index, "type", e.target.value)}
                style={{ marginLeft: "8px" }}
              >
                <option value="">Tipo de Dano</option>
                <option value="corte">Corte</option>
                <option value="concussão">Concussão</option>
                <option value="perfuração">Perfuração</option>
                <option value="fogo">Fogo</option>
                <option value="gelo">Gelo</option>
                <option value="ácido">Ácido</option>
                <option value="veneno">Veneno</option>
                <option value="energia">Energia</option>
              </select>

              <button type="button" onClick={() => removeDamageEntry(index)}>
                Remover
              </button>
            </div>
          ))}
          <button type="button" onClick={addDamageEntry}>
            Adicionar Dado de Dano
          </button>
        </fieldset>

        <label>
          Peso (em kg):
          <input type="number" name="weight" step="0.1" required />
        </label>

        <fieldset>
          <legend>Valor em moedas</legend>
          <input type="number" name="pp" placeholder="PP" min={0} /> Platina
          <br />
          <input type="number" name="gp" placeholder="GP" min={0} /> Ouro
          <br />
          <input type="number" name="sp" placeholder="SP" min={0} /> Prata
          <br />
          <input type="number" name="cp" placeholder="CP" min={0} /> Cobre
        </fieldset>

        <label>
          Raridade:
          <select name="rarity" required>
            <option value="comum">Comum</option>
            <option value="incomum">Incomum</option>
            <option value="raro">Raro</option>
            <option value="muito raro">Muito Raro</option>
            <option value="lendário">Lendário</option>
          </select>
        </label>

        <label>
          Imagem do Item (opcional):
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        <button type="submit">Adicionar</button>
      </FormDefault>

      <button onClick={handleGoBack} className="back-button">
        Voltar
      </button>
    </div>
  );
};

export default AddItem;
