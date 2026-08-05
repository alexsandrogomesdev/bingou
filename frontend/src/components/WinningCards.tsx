import { useState } from "react";

import { X } from "lucide-react";

// STYLES
import styles from "./WinningCards.module.css";

// HOOKS

// COMPONENTS
import Card from "../components/Card";

// INTERFACES AND TYPES
import type { Winnings } from "../types/pack";

interface Props {
  balls: number[];
  winnings: Winnings[];
  setShowWinnings: React.Dispatch<React.SetStateAction<boolean>>;
}

const WinningCards: React.FC<Props> = ({
  balls,
  winnings,
  setShowWinnings,
}) => {
  console.log(winnings);
  return (
    <section className={styles.section_winning_cards}>
      <div className={styles.div_winnings_cards}>
        <X onClick={() => setShowWinnings(false)} />
        <h3 className={`${winnings.length > 0 && styles.animated_title}`}>
          BINGO
        </h3>
        <p>
          {winnings.length > 0
            ? "Cartelas premiadas."
            : "Não há cartelas premiadas."}
        </p>
        <div className={styles.div_winnings}>
          {winnings.length >= 0 &&
            winnings.reverse().map((item) => (
              <div key={item.ball} className={styles.winnings_per_ball}>
                <p>Bola: {item.ball}</p>
                {item.winnings.map((win) => (
                  <div className={styles.cards_per_modality}>
                    <p>Modalidade: {win.modality.name}</p>
                    <span>Cartelas</span>
                    <div className={styles.cards}>
                      {win.cards.map((card, index) => (
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
            ))}
        </div>
      </div>
    </section>
  );
};

export default WinningCards;
