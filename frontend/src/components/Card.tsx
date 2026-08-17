import { useMemo, memo, useState, useCallback } from "react";

// STYLES
import styles from "./Card.module.css";

// HOOKS

// COMPONENTS
import CardNumber from "./CardNumber.tsx";
import { Pencil, Trash2 } from "lucide-react";

interface CardsProps {
  index: number;
  id: number;
  ball?: number;
  balls: Set<number>;
  cardNumbers: number[];
  pattern?: number[];
  isGoodCard?: boolean;
  goodBalls?: Set<number>;
  handleRemoveCard?: (id: number) => void;
}

const Card = ({
  index,
  id,
  balls,
  cardNumbers,
  pattern,
  isGoodCard,
  goodBalls,
  handleRemoveCard,
}: CardsProps) => {
  // console.log(`Card: ${id}`);
  const [showEditCard, setShowEditCard] = useState<boolean>(false);

  const cardNumbersKey = cardNumbers.join(",");
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < cardNumbers.length; i++) {
      cols[Math.floor(i / 5)].push(cardNumbers[i]);
    }
    return cols;
  }, [cardNumbersKey]);

  console.log("Card: " + id);

  const handleEditCard = useCallback(() => {
    setShowEditCard((prevShowEditCard) => {
      return prevShowEditCard ? false : true;
    });
    return;
  }, []);

  return (
    <>
      <article
        className={`${styles.card} ${isGoodCard && styles.good_card}`}
        onClick={() => handleEditCard()}
      >
        <div className={styles.card_header}>
          <p>#{index}</p>
          <span>({id})</span>
        </div>
        <div className={styles.card_letters}>
          <strong>B</strong>
          <strong>I</strong>
          <strong>N</strong>
          <strong>G</strong>
          <strong>O</strong>
        </div>
        <div
          className={`${styles.card_options} ${showEditCard ? styles.show_edit_card : ""}`}
        >
          <button>
            <Pencil />
          </button>
          <button onClick={() => handleRemoveCard?.(id)}>
            <Trash2 />
          </button>
        </div>
        <div
          className={`${styles.card_body} ${!showEditCard ? styles.show_body : ""}`}
        >
          {columns.map((column, index) => (
            <ul key={`${id}_c_${index}`} className={styles.card_column}>
              {column.map((number) => {
                return (
                  <CardNumber
                    key={`${id}_${number}`}
                    number={number}
                    isMarked={balls.has(number)}
                    onPattern={
                      pattern && pattern.includes(number) ? true : false
                    }
                    isGoodBall={
                      goodBalls && goodBalls.has(number) ? true : false
                    }
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
