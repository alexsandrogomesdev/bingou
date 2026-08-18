import { useState, useMemo, memo } from "react";

// STYLES
import styles from "./NewPattern.module.css";
import { Sparkles } from "lucide-react";
import type { ModalitiesInterface } from "../types/pack";

// HOOKS

// COMPONENTS

interface Props {
  modality: number;
  setShowNewPattern: React.Dispatch<React.SetStateAction<boolean>>;
  modalities: ModalitiesInterface[];
  setModalities: React.Dispatch<React.SetStateAction<ModalitiesInterface[]>>;
}
const NewPattern = ({
  modality,
  setShowNewPattern,
  modalities,
  setModalities,
}: Props) => {
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < 25; i++) {
      cols[Math.floor(i / 5)].push(i);
    }
    return cols;
  }, []);

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
  const handleSaveNewPattern = () => {
    const newModalities = [...modalities];
    for (let a = 0; a < newModalities.length; a++) {
      if (newModalities[a].id === modality) {
        newModalities[a].maps.push([1, ...pattern.sort((a, b) => a - b)]);
        break;
      }
    }
    setModalities(newModalities);
    setShowNewPattern(false);
    return;
  };

  return (
    <section className={styles.section_new_pattern}>
      <div className={styles.div_new_pattern}>
        <p>Novo padrão</p>
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
          <button onClick={() => setShowNewPattern(false)}>Cancelar</button>
          <button onClick={handleSaveNewPattern}>Salvar</button>
        </div>
      </div>
    </section>
  );
};

export default memo(NewPattern);
