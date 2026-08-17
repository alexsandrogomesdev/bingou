import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { X } from "lucide-react";

// STYLES
import styles from "./NewPack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

// TYPES AND INTERFACES
type Props = {
  sectionNewPack: boolean;
  setSectionNewPack: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewPack = ({ sectionNewPack, setSectionNewPack }: Props) => {
  const mainContext = useMainContext();
  const { request } = useFetch();
  const navigate = useNavigate();

  localStorage.setItem("max_cards", String(100)); // remove after backend is done

  const [packName, setPackName] = useState<string>("");
  const [cardsQty, setCardsQty] = useState<number>(50);
  const [creating, setCreating] = useState<boolean>(false);

  const handleCreatePack = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCreating(true);
    setCardsQty(0);

    interface CreatePackType {
      message: string;
      result: {
        packId: number;
      };
    }

    const createPack: CreatePackType = await request(
      "/packs/new",
      "POST",
      {},
      {
        name: packName,
        qty: cardsQty,
      },
    );

    setCreating(false);

    if (createPack.message === "ok") {
      navigate(`/pack/${createPack.result.packId}`);
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: createPack.message,
      });
    }
  };

  const canCreate: boolean =
    packName.length >= 2 && cardsQty >= 1 && cardsQty <= 10000;

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
              value={cardsQty}
              placeholder={"50"}
            />
          </label>

          <button
            type="submit"
            disabled={canCreate ? false : true}
            className={
              canCreate ? styles.submit_enabled : styles.submit_disabled
            }
          >
            {creating ? "Criando..." : "Criar Pacote"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewPack;
