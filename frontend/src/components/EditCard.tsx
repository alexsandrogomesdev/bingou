import { useState, memo } from "react";

// STYLES
import styles from "./EditCard.module.css";
import { Sparkles, X } from "lucide-react";

// HOOKS
import { useMainContext } from "../hooks/useMainContext";
import { useFetch } from "../hooks/useFetch";

// COMPONENTS

interface Props {
  id: number;
  columns: number[][];
  setShowChangeNumbers: React.Dispatch<React.SetStateAction<boolean>>;
  setCardNumbersKey: React.Dispatch<React.SetStateAction<number[]>>;
}
const EditCard = ({
  id,
  columns,
  setShowChangeNumbers,
  setCardNumbersKey,
}: Props) => {
  const mainContext = useMainContext();

  const [numbers, setNumbers] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const [atualNumber, setAtualNumber] = useState<number>();
  const [showNumbers, setShowNumbers] = useState<boolean>(false);
  const handleChangeNumber = (number: number) => {
    if (number === 0) return;

    let start = 1;
    let end = 15;

    if (number > 15 && number <= 30) {
      start = 16;
      end = 30;
    } else if (number > 30 && number <= 45) {
      start = 31;
      end = 45;
    } else if (number > 45 && number <= 60) {
      start = 46;
      end = 60;
    } else if (number > 60 && number <= 75) {
      start = 61;
      end = 75;
    }

    const newNumbers = [];
    for (let a = start; a <= end; a++) {
      if (!columnsToShow.some((column) => column.includes(a)))
        newNumbers.push(a);
    }
    setNumbers(newNumbers);

    setAtualNumber(number);
    setShowNumbers(true);
    return;
  };

  const [columnsToShow, setColumnsToShow] = useState<number[][]>(
    columns.map((column) => [...column]),
  );

  const handleChooseNumber = (number: number) => {
    const columnsToEdit = columnsToShow.map((column) => [...column]);
    const exist = columnsToEdit.some((column) => column.includes(number));
    if (exist) {
      mainContext.setAlert({
        id: Number(crypto.randomUUID()) + number,
        type: "error",
        message: `O número ${number} já está na cartela.`,
      });
      return;
    }

    for (let a = 0; a < columnsToEdit.length; a++) {
      for (let b = 0; b < columnsToEdit[a].length; b++) {
        if (columnsToEdit[a][b] === atualNumber) {
          columnsToEdit[a][b] = number;
          break;
        }
      }
    }

    setColumnsToShow(columnsToEdit);
    setShowNumbers(false);
    return;
  };

  const [saving, setSaving] = useState<boolean>(false);
  const { request } = useFetch();

  const handleSaveCard = async () => {
    setSaving(true);
    const saveCard: { message: string } = await request(
      `/cards/${id}`,
      "PATCH",
      {},
      {
        numbers: columnsToShow.flat(),
      },
    );
    setSaving(false);
    if (saveCard.message === "ok") {
      mainContext.setAlert({
        id: Number(crypto.randomUUID()),
        type: "success",
        message: "Cartela alterada com sucesso.",
      });
      setShowChangeNumbers(false);
      setCardNumbersKey(columnsToShow.flat());
    } else {
      mainContext.setAlert({
        id: Number(crypto.randomUUID()),
        type: "error",
        message: "Erro ao salvar cartela alterada, tente novamente!",
      });
    }
  };

  return (
    <section className={styles.section_edit_card}>
      <div className={styles.div_edit_card}>
        <nav>
          <p>Alterar números da cartela</p>
          <X onClick={() => setShowChangeNumbers(false)} />
        </nav>

        <div className={styles.card_header}>
          <span>B</span>
          <span>I</span>
          <span>N</span>
          <span>G</span>
          <span>O</span>
        </div>
        <div
          className={`${styles.card_body} ${showNumbers ? styles.hide : styles.show}`}
        >
          {columnsToShow.map((column, index) => (
            <ul key={`${id}_c_${index}`} className={styles.card_column}>
              {column.map((number) => {
                return (
                  <li
                    key={`${id}_${number}`}
                    onClick={() => handleChangeNumber(number)}
                  >
                    {number === 0 ? <Sparkles /> : number}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
        <div
          className={`${styles.div_numbers} ${showNumbers ? styles.show : styles.hide}`}
        >
          <div>
            <div>
              <span>Número atual</span>
              <X onClick={() => setShowNumbers(false)} />
            </div>

            <p>{atualNumber}</p>
          </div>
          <div>
            {numbers.map((number) => (
              <p
                key={`number_to_change_${number}`}
                onClick={() => handleChooseNumber(number)}
              >
                {number}
              </p>
            ))}
          </div>
        </div>

        <div className={styles.div_buttons}>
          <button onClick={() => setShowChangeNumbers(false)}>Cancelar</button>
          <button onClick={handleSaveCard} disabled={saving}>
            Salvar
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(EditCard);
