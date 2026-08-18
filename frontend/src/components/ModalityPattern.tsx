import { useMemo, memo } from "react";

// STYLES
import styles from "./ModalityPattern.module.css";
import { Sparkles, ToggleLeft, ToggleRight } from "lucide-react";

// HOOKS

// COMPONENTS

const ModalityPattern = ({
  modality,
  map,
  index,
  changeMap,
}: {
  modality: number;
  map: number[];
  index: number;
  changeMap: (modality: number, index: number, on: number) => void;
}) => {
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < 25; i++) {
      cols[Math.floor(i / 5)].push(i);
    }
    return cols;
  }, []);

  const mapOn = map[0];
  const TheMap = map.slice(1);

  return (
    <section className={styles.section_map}>
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
                  className={`${TheMap.includes(number) && styles.selected} ${number === 12 && styles.joker} ${styles.number}`}
                >
                  {number === 12 ? <Sparkles /> : ""}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
      {mapOn === 1 ? (
        <ToggleRight
          className={styles.modality_enabled}
          onClick={() => changeMap(modality, index, 0)}
        />
      ) : (
        <ToggleLeft
          className={styles.modality_disabled}
          onClick={() => changeMap(modality, index, 1)}
        />
      )}
    </section>
  );
};

export default memo(ModalityPattern);
