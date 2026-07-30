import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

import { X } from "lucide-react";

import * as fts from "../utils/functions.ts";

// STYLES
import styles from "./NewPack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

// COMPONENTS

// TYPES AND INTERFACES
type Props = {
  sectionNewPack: boolean;
  setSectionNewPack: Dispatch<SetStateAction<boolean>>;
};

const NewPack = ({ sectionNewPack, setSectionNewPack }: Props) => {
  const mainContext = useMainContext();

  localStorage.setItem("max_cards", String(100)); // remove after backend is done

  const [packName, setPackName] = useState<string>("");
  const [cardsQty, setCardsQty] = useState<number>(50);

  const handleCreatePack = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    type Cards = {
      id: number;
      pack: number | null;
      user: number | null;
      numbers: Uint8Array;
      created_at: number;
    };

    const cards: Cards[] = [];

    const packId: number = fts.getRandomNumber(1000, 100000); // PROBLEM - UPDATE IT WHEN BACKEND IS DONE

    for (let c = 0; c < cardsQty; c++) {
      const base: number[] = [];
      for (let d = 1; d <= 75; d++) base.push(d);

      const B: number[] = [];
      const I: number[] = [];
      const N: number[] = [];
      const G: number[] = [];
      const O: number[] = [];

      while (base.length > 51) {
        const number: number = base[fts.getRandomNumber(0, base.length - 1)];
        if (number >= 1 && number <= 15 && B.length <= 4) {
          B.push(number);
        } else if (number >= 16 && number <= 30 && I.length <= 4) {
          I.push(number);
        } else if (number >= 31 && number <= 45 && N.length <= 3) {
          N.push(number);
        } else if (number >= 46 && number <= 60 && G.length <= 4) {
          G.push(number);
        } else if (number >= 61 && number <= 75 && O.length <= 4) {
          O.push(number);
        } else {
          continue;
        }

        const index = base.indexOf(number);
        if (index !== -1) base.splice(index, 1);
      }

      const numbers: number[] = [];
      B.forEach((n) => {
        numbers.push(fts.encodeByte(false, n));
      });
      I.forEach((n) => {
        numbers.push(fts.encodeByte(false, n));
      });
      N.forEach((n) => {
        numbers.push(fts.encodeByte(false, n));
      });
      G.forEach((n) => {
        numbers.push(fts.encodeByte(false, n));
      });
      O.forEach((n) => {
        numbers.push(fts.encodeByte(false, n));
      });

      cards.push({
        id: c,
        pack: packId,
        user: null,
        numbers: new Uint8Array(numbers),
        created_at: Math.floor(Date.now() / 1000),
      });
    }

    // ...
  };

  const canCreate: boolean =
    packName.length >= 2 && cardsQty >= 1 && cardsQty <= 2000;

  return (
    <section
      className={`${styles.section_new_pack} ${sectionNewPack ? styles.new_pack_show : styles.new_pack_hide}`}
    >
      <div className={styles.div_new_pack}>
        <nav>
          <h3>Novo Pack</h3>
          <X onClick={() => setSectionNewPack(false)} />
        </nav>
        <form
          className={styles.form_create_pack}
          onSubmit={(e) => handleCreatePack(e)}
        >
          <label>
            <span>Nome do pacote</span>
            <input
              type="text"
              name="pack-name"
              value={packName}
              onChange={(e) => setPackName(e.target.value)}
              placeholder={"Bingo da família"}
            />
          </label>

          <label>
            <span>Quantidade de cartelas</span>
            <input
              type="text"
              name="cards-qty"
              onChange={(e) => setCardsQty(Number(e.target.value))}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={"50"}
            />
          </label>

          <input
            type="submit"
            value="Criar Pacote"
            disabled={canCreate ? false : true}
            className={
              canCreate ? styles.submit_enabled : styles.submit_disabled
            }
          />
        </form>
      </div>
    </section>
  );
};

export default NewPack;
