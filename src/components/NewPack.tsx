import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

import { X } from "lucide-react";

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

    mainContext.setAlert({
      id: Math.floor(Math.random() * 1001),
      type: "error",
      message: "Errou",
    });
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
