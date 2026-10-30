import { useMemo, memo, useState, useCallback } from "react";

// STYLES
import styles from "./Card.module.css";
import { Pencil, Trash2 } from "lucide-react";

// HOOKS

// COMPONENTS
import CardNumber from "./CardNumber.tsx";
import EditCard from "./EditCard.tsx";

interface CardsProps {
  index: number;
  id: number;
  ball?: number;
  balls: Set<number>;
  cardNumbers: number[];
  pattern?: number[];
  goodBalls?: number[];
  handleRemoveCard?: (id: number) => void;
}

const Card = ({ index, id, balls, cardNumbers, pattern, goodBalls, handleRemoveCard }: CardsProps) => {
  const [showEditCard, setShowEditCard] = useState<boolean>(false);
  const [showChangeNumbers, setShowChangeNumbers] = useState<boolean>(false);

  const [cardNumbersKey, setCardNumbersKey] = useState<number[]>([...cardNumbers]);
  const columns = useMemo(() => {
    const cols: number[][] = [[], [], [], [], []];
    for (let i = 0; i < cardNumbersKey.length; i++) {
      cols[Math.floor(i / 5)].push(cardNumbersKey[i]);
    }
    return cols;
  }, [cardNumbersKey]);

  // console.log("Card: " + id);

  const handleEditCard = useCallback(() => {
    setShowEditCard((prevShowEditCard) => {
      return prevShowEditCard ? false : true;
    });
    return;
  }, []);

  const handleChangeNumbers = () => {
    setShowChangeNumbers(true);
    return;
  };

  const goodCard = goodBalls && goodBalls.length > 0 ? true : false;

  return (
    <section className={`${styles.section} ${goodCard ? styles.good_card : ""}`}>
      {showChangeNumbers && (
        <EditCard
          id={id}
          columns={[...columns]}
          setShowChangeNumbers={setShowChangeNumbers}
          setCardNumbersKey={setCardNumbersKey}
        />
      )}

      <article className={`${styles.card}`} onClick={() => handleEditCard()}>
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
        <div className={`${styles.card_options} ${showEditCard ? styles.show_edit_card : ""}`}>
          <button onClick={handleChangeNumbers}>
            <Pencil />
          </button>
          <button onClick={() => handleRemoveCard?.(id)}>
            <Trash2 />
          </button>
        </div>
        <div className={`${styles.card_body} ${!showEditCard ? styles.show_body : ""}`}>
          {columns.map((column, index) => (
            <ul key={`${id}_c_${index}`} className={styles.card_column}>
              {column.map((number) => {
                return (
                  <CardNumber
                    key={`${id}_${number}`}
                    number={number}
                    isMarked={balls.has(number)}
                    onPattern={pattern && pattern.includes(number) ? true : false}
                    isGoodBall={goodBalls && goodBalls.includes(number) ? true : false}
                  />
                );
              })}
            </ul>
          ))}
        </div>
      </article>
    </section>
  );
};

export default memo(Card, (prevProps, nextProps) => {
  if (prevProps.ball === nextProps.ball) {
    // return true;
  }
  if (nextProps.goodBalls && prevProps.goodBalls && nextProps.goodBalls.length !== prevProps.goodBalls.length) {
    return false;
  }
  if (nextProps.ball && nextProps.cardNumbers.includes(nextProps.ball)) {
    return false;
  }
  return true;
});
