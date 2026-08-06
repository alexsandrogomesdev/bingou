import { useState, useMemo, memo, useEffect } from "react";
import { Globe } from "lucide-react";

// STYLES
import styles from "./Card.module.css";

// HOOKS

// COMPONENTS
interface CardsProps {
  index: number;
  id: number;
  balls: Set<number>;
  cardNumbers: number[];
  pattern?: Set<number>;
}
const Card: React.FC<CardsProps> = memo(
  ({ index, id, balls, cardNumbers, pattern }) => {
    const columns = useMemo(() => {
      const cols: number[][] = [[], [], [], [], []];
      for (let i = 0; i < cardNumbers.length; i++) {
        const colIndex = Math.floor(i / 5);
        cols[colIndex].push(cardNumbers[i]);
      }
      return cols;
    }, [cardNumbers]);

    useEffect(() => {}, [balls, pattern]);

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
                      className={`${balls.has(number) ? styles.number_selected : ""} ${number === 0 ? styles.joker : ""} ${pattern ? (pattern.has(number) ? styles.number_selected_2 : "") : ""}`}
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
  },
);

export default Card;
