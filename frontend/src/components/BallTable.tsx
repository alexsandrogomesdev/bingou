import { useState } from "react";

import { X } from "lucide-react";

// STYLES
import styles from "./BallTable.module.css";

// HOOKS

// COMPONENTS
interface Props {
  balls: number[];
  handleSelectBall: (ball: number) => void;
  setShowBallTable: React.Dispatch<React.SetStateAction<boolean>>;
}
const BallTable: React.FC<Props> = ({
  balls,
  handleSelectBall,
  setShowBallTable,
}) => {
  const table_numbers: Array<number[]> = [[], [], [], [], []];
  for (let c = 0; c < 5; c++) {
    const min = 1 + c * 15;
    const max = 15 + c * 15;
    for (let d = min; d <= max; d++) {
      table_numbers[c].push(d);
    }
  }

  return (
    <section className={styles.section_ball_tables}>
      <nav>
        <h3>Bolas chamadas</h3>
        <X onClick={() => setShowBallTable(false)} />
      </nav>
      <div className={styles.table_body}>
        {table_numbers.map((column, index) => (
          <ul key={index} className={styles.table_column}>
            {column.map((ball) => (
              <li
                key={ball}
                className={`${styles.number} ${balls.includes(ball) && styles.number_selected}`}
                onClick={() => handleSelectBall(ball)}
              >
                <span>{ball}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export default BallTable;
