import { X } from "lucide-react";
import { memo } from "react";

// STYLES
import styles from "./BallTable.module.css";

// HOOKS
import type { Goods } from "../types/pack";

// COMPONENTS
interface Props {
  balls: Set<number>;
  handleSelectBall: (ball: number) => void;
  setShowBallTable: React.Dispatch<React.SetStateAction<boolean>>;
  goods: Goods[];
}
const BallTable = ({
  balls,
  handleSelectBall,
  setShowBallTable,
  goods,
}: Props) => {
  const table_numbers: Array<number[]> = [[], [], [], [], []];
  for (let c = 0; c < 5; c++) {
    const min = 1 + c * 15;
    const max = 15 + c * 15;
    for (let d = min; d <= max; d++) {
      table_numbers[c].push(d);
    }
  }

  return (
    <section className={styles.section_balls_table}>
      <div className={styles.div_balls_table}>
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
                  className={`${styles.number} ${balls.has(ball) && styles.number_selected} ${goods.some((item) => item.ball === ball) ? styles.good_ball : ""}`}
                  onClick={() => handleSelectBall(ball)}
                >
                  <span>{ball}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(BallTable);
