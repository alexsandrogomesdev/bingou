import { X } from "lucide-react";

// STYLES
import styles from "./WinningCards.module.css";

// HOOKS

// COMPONENTS
import Card from "./Card";

// INTERFACES AND TYPES
import type { Winnings } from "../types/pack";

interface Props {
  balls: Set<number>;
  winnings: Winnings[];
  setShowWinnings: React.Dispatch<React.SetStateAction<boolean>>;
}

const WinningCards: React.FC<Props> = ({
  balls,
  winnings,
  setShowWinnings,
}) => {
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
              .map((item) => <WinningsPerBall item={item} balls={balls} />)}
        </div>
      </div>
    </section>
  );
};

interface Props2 {
  item: Winnings;
  balls: Set<number>;
}
const WinningsPerBall = ({ item, balls }: Props2) => {
  return (
    <div key={item.ball} className={styles.winnings_per_ball}>
      <p>Bola: {item.ball}</p>
      {item.winnings.map((win, index) => (
        <div key={`div_item_${index}`} className={styles.cards_per_modality}>
          <p>Modalidade: {win.modality.name}</p>
          <span>Cartelas</span>
          <div className={styles.cards}>
            {[...win.cards].map((card, index) => (
              <Card
                key={card.id}
                index={index + 1}
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

export default WinningCards;
