import { X } from "lucide-react";
import { memo, useCallback } from "react";

// STYLES
import styles from "./WinningCards.module.css";

// HOOKS

// COMPONENTS
import Card from "./Card";

// INTERFACES AND TYPES
import type { Winnings, Cards } from "../types/pack";

interface Props {
  balls: Set<number>;
  winnings: Winnings[];
  setShowWinnings: React.Dispatch<React.SetStateAction<boolean>>;
  cards: Cards[];
}

const WinningCards = ({ balls, winnings, setShowWinnings, cards }: Props) => {
  const cardsIndex = useCallback(() => {
    const index: number[] = [];
    for (let a = 0; a < cards.length; a++) {
      index.push(cards[a].id);
    }
    return index;
  }, [cards]);

  return (
    <section className={styles.section_winning_cards}>
      <div className={styles.div_winnings_cards}>
        <nav>
          <h3 className={`${winnings.length > 0 && styles.animated_title}`}>
            BINGO
          </h3>
          <X onClick={() => setShowWinnings(false)} />
        </nav>
        <p>
          {winnings.length > 0
            ? "Cartelas premiadas."
            : "Não há cartelas premiadas."}
        </p>
        <div className={styles.div_winnings}>
          {winnings.length > 0 &&
            winnings
              .toReversed()
              .map((item, index) => (
                <WinningsPerBall
                  key={`winningsPerBall_${index}`}
                  item={item}
                  balls={balls}
                  cardsIndex={cardsIndex()}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

interface Props2 {
  item: Winnings;
  balls: Set<number>;
  cardsIndex: number[];
}
const WinningsPerBall = ({ item, balls, cardsIndex }: Props2) => {
  return (
    <div key={item.ball} className={styles.winnings_per_ball}>
      <p>
        Bola: <strong>{item.ball}</strong>
      </p>
      {item.winnings.map((win, index) => (
        <div key={`div_item_${index}`} className={styles.cards_per_modality}>
          <p>Modalidade: {win.modality.name}</p>
          <div className={styles.cards}>
            {[...win.cards].map((card) => (
              <Card
                key={card.id}
                index={cardsIndex.findIndex((item) => item === card.id) + 1}
                id={card.id}
                balls={balls}
                cardNumbers={card.numbers}
                pattern={card.pattern}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(WinningCards);
