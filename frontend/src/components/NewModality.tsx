// STYLES
import { useMemo, useState, memo } from "react";
import styles from "./NewModality.module.css";
import { Sparkles, X } from "lucide-react";

// HOOKS
import type { ModalitiesInterface } from "../types/pack";

// COMPONENTS
interface Props {
  setShowNewModality: React.Dispatch<React.SetStateAction<boolean>>;
  setModalities: React.Dispatch<React.SetStateAction<ModalitiesInterface[]>>;
}
const NewModality = ({ setShowNewModality, setModalities }: Props) => {
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < 25; i++) {
      cols[Math.floor(i / 5)].push(i);
    }
    return cols;
  }, []);

  const [name, setName] = useState<string>("");
  const [pattern, setPattern] = useState<number[]>([]);

  const selectIndex = (index: number) => {
    if (index === 12) return;
    setPattern((prevPattern) => {
      if (prevPattern.includes(index)) {
        return prevPattern.filter((item) => item !== index);
      } else {
        return [...prevPattern, index];
      }
    });
    return;
  };
  const handleSaveNewModality = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const newModality = {
      id: Math.floor(Date.now() / 1000),
      on: true,
      name: name,
      maps: [[1, ...pattern.sort((a, b) => a - b)]],
    };

    setModalities((prevModalities) => {
      return [...prevModalities, newModality];
    });

    setShowNewModality(false);
    return;
  };

  return (
    <section className={styles.section_new_modality}>
      <div className={styles.div_new_modality}>
        <nav className={styles.div_modalities_header}>
          <p>Nova Modalidade</p>
          <X onClick={() => setShowNewModality(false)} />
        </nav>
        <form className={styles.form}>
          <input
            type="text"
            placeholder="Nome da modalidade"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <p>Padrão</p>
          <div className={styles.div_pattern}>
            {columns.map((column, index) => (
              <ul
                key={`new_modality_column_${index}`}
                className={styles.ul_pattern}
              >
                {column.map((number) => (
                  <li
                    key={`new_modality_column_${index}_${number}`}
                    onClick={() => selectIndex(number)}
                    className={`${pattern.includes(number) ? styles.selected_index : ""} ${number === 12 ? styles.joker : ""}`}
                  >
                    {number === 12 ? <Sparkles /> : ""}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className={styles.div_buttons}>
            <button onClick={() => setShowNewModality(false)}>Cancelar</button>
            <button onClick={(e) => handleSaveNewModality(e)}>Salvar</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default memo(NewModality);
