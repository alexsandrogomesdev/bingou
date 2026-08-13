import { useMemo } from "react";

// STYLES
import styles from "./ModalityExample.module.css";

// HOOKS

// COMPONENTS
import { Sparkles } from "lucide-react";

const ModalityExample = ({
  modality,
  map,
}: {
  modality: number;
  map: number[];
}) => {
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < 25; i++) {
      cols[Math.floor(i / 5)].push(i);
    }
    return cols;
  }, []);

  return (
    <div className={styles.card_body}>
      {columns.map((column, index) => (
        <ul
          key={`modality_${modality}_map_${index}`}
          className={styles.card_column}
        >
          {column.map((number, i2) => {
            return (
              <li
                key={`column_${index}_number_${i2}`}
                className={`${map.includes(number) && styles.selected} ${number === 12 && styles.joker} ${styles.number}`}
              >
                {number === 12 ? <Sparkles /> : ""}
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
};

export default ModalityExample;
