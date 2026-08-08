import { useState } from "react";
import { X, Check } from "lucide-react";

// STYLES
import styles from "./AddCards.module.css";

// HOOKS
import { useFetch } from "../hooks/useFetch";
import { useMainContext } from "../hooks/useMainContext";

// COMPONENTS

interface Props {
  packId: number | string;
  setShowAddCards: React.Dispatch<React.SetStateAction<boolean>>;
  setCardsAdded: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddCards = ({ packId, setShowAddCards, setCardsAdded }: Props) => {
  const [qty, setQty] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const { request } = useFetch();

  const mainContext = useMainContext();

  const handleAddCards = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const addCards: { message: string } = await request(
      `/pack/${packId}/addCards`,
      "POST",
      {},
      {
        qty: qty,
      },
    );
    setLoading(false);
    if (addCards.message === "ok") {
      setCardsAdded((prevCardsAdded) => {
        return prevCardsAdded ? false : true;
      });
      setShowAddCards(false);
      mainContext.setAlert({
        id: Date.now(),
        type: "success",
        message: `${qty} cartelas foram adicionadas ao seu maço.`,
      });
    } else {
      mainContext.setAlert({
        id: Date.now(),
        type: "error",
        message: addCards.message,
      });
    }
  };
  return (
    <section className={styles.section_add_cards}>
      <div className={styles.div_add_cards}>
        <nav>
          <p>Adicionar novas cartelas</p>
          <X onClick={() => setShowAddCards(false)} />
        </nav>
        <form
          className={styles.form_add_cards}
          onSubmit={(e) => handleAddCards(e)}
        >
          <label htmlFor="">Quantidade cartelas</label>
          <div>
            <input
              type="text"
              inputMode={`numeric`}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 0)}
            />
            <button disabled={loading}>
              <Check />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddCards;
