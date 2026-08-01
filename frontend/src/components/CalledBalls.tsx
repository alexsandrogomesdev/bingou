import { useState } from "react";

// STYLES
import styles from "./CalledBalls.module.css";

// HOOKS
import { useFetch } from "../hooks/useFetch";

// COMPONENTS
interface Props {
  numbers: number[];
  packId: string;
}

const CalledBalls: React.FC<Props> = ({ numbers, packId }) => {
  const { request } = useFetch();
  const [balls, setBalls] = useState<number[]>(numbers);

  const table_numbers: Array<number[]> = [[], [], [], [], []];
  for (let c = 0; c < 5; c++) {
    const min = 1 + c * 15;
    const max = 15 + c * 15;
    for (let d = min; d <= max; d++) {
      table_numbers[c].push(d);
    }
  }

  const handleChooseBall = (number: number) => {
    setBalls((prevBalls) => {
      if (prevBalls.includes(number)) {
        return prevBalls.filter((b) => b !== number);
      }
      return [...prevBalls, number];
    });
  };

  return (
    <section className={styles.section_called_balls}>
      <h3>Bolas chamadas</h3>
      <div className={styles.table_body}>
        {table_numbers.map((column) => (
          <ul className={styles.table_column}>
            {column.map((number) => (
              <li
                className={`${styles.number} ${balls.includes(number) && styles.number_selected}`}
                onClick={() => handleChooseBall(number)}
              >
                <span>{number}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export default CalledBalls;
