import { useState } from "react";
import { Globe } from "lucide-react";

// STYLES
import styles from "./Card.module.css";

// HOOKS

// COMPONENTS
interface CardsProps {
  index: number;
  id: number;
  balls: number[];
  cardNumbers: number[];
  pattern?: number[];
}
const Card: React.FC<CardsProps> = ({
  index,
  id,
  balls,
  cardNumbers,
  pattern,
}) => {
  const columns: Array<number[]> = [[], [], [], [], []];
  cardNumbers.forEach((number, index) => {
    const column = Math.floor(index / 5);
    columns[column].push(number);
  });
  const ballsSet = new Set(balls);
  const patternSet = new Set(pattern);

  return (
    <>
      <article className={styles.card}>
        <div className={styles.card_header}>
          <p>
            Cartela: #{index} ({id})
          </p>
        </div>
        <div className={styles.card_letters}>
          <strong>B</strong>
          <strong>I</strong>
          <strong>N</strong>
          <strong>G</strong>
          <strong>O</strong>
        </div>
        <div className={styles.card_body}>
          {columns.map((column, index) => (
            <ul key={index} className={styles.card_column}>
              {column.map((number) => (
                <li key={number} className={styles.number}>
                  <span
                    className={`${ballsSet.has(number) && styles.number_selected} ${number === 0 && styles.joker} ${patternSet && patternSet.has(number) && styles.number_selected_2}`}
                  >
                    {number === 0 ? <Globe /> : number}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </article>
    </>
  );
};

export default Card;
