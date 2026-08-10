import { useState, useMemo, memo, useEffect } from "react";
import { Globe } from "lucide-react";

// STYLES
import styles from "./Card.module.css";

// HOOKS

// COMPONENTS
import CardNumber from "./CardNumber.tsx";

interface CardsProps {
  index: number;
  id: number;
  ball?: number;
  balls: Set<number>;
  cardNumbers: number[];
  pattern?: Set<number>;
}
const Card = ({ index, id, ball, balls, cardNumbers, pattern }: CardsProps) => {
  // console.log(`Card: ${id}`);
  const cardNumbersKey = cardNumbers.join(",");
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < cardNumbers.length; i++) {
      cols[Math.floor(i / 5)].push(cardNumbers[i]);
    }
    return cols;
  }, [cardNumbersKey]);

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
            <ul key={`${id}_c_${index}`} className={styles.card_column}>
              {column.map((number) => {
                return (
                  <CardNumber
                    key={`${id}_${number}`}
                    number={number}
                    isMarked={balls.has(number)}
                    onPattern={pattern && pattern.has(number) ? true : false}
                  />
                );
              })}
            </ul>
          ))}
        </div>
      </article>
    </>
  );
};

export default memo(Card, (prevProps, nextProps) => {
  if (nextProps.ball && prevProps.cardNumbers.includes(nextProps.ball)) {
    return false;
  }
  return true;
});
