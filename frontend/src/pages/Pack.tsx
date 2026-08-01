import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// STYLES
import styles from "./Pack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS
import Card from "../components/Card.tsx";
import CalledBalls from "../components/CalledBalls.tsx";

const Pack = () => {
  const mainContext = useMainContext();
  interface Card {
    id: number;
    numbers: {
      data: number[];
    };
  }
  const [cards, setCards] = useState<Card[]>([]);
  const [numbers, setNumbers] = useState<number[]>();
  const [packName, setPackName] = useState<string>("");
  const [balls, setBalls] = useState<number[]>();

  const { request } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const getCards = async () => {
      interface GetCardsType {
        message: string;
        result: {
          cards: Card[];
          name: string;
          numbers: {
            data: number[];
          };
        };
      }
      const response: GetCardsType = await request(`/packs/${id}`, "GET");
      setCards(response.result.cards);
      setPackName(response.result.name);
      setNumbers(response.result.numbers.data);

      const balls: number[] = [];
      for (let c = 1; c <= 75; c++) {
        balls.push(c);
      }
      setBalls(balls);
    };
    getCards();
  }, []);

  return (
    <section className={styles.section_pack}>
      <h2 className={styles.pack_title}>{packName}</h2>
      <br></br>
      {numbers && id && <CalledBalls numbers={numbers} packId={id} />}
      <br></br>
      <div className={styles.cards}>
        {numbers &&
          cards.map((card, index) => (
            <Card
              key={index}
              index={index + 1}
              id={card.id}
              numbers={numbers}
              cardNumbers={card.numbers.data}
            />
          ))}
      </div>
    </section>
  );
};

export default Pack;
