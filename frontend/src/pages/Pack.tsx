import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// STYLES
import styles from "./Pack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS

const Pack = () => {
  const mainContext = useMainContext();
  interface Card {
    id: number;
    numbers: Uint8Array;
  }
  const [cards, setCards] = useState<Card[]>([]);

  const { request } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const getCards = async () => {
      interface GetCardsType {
        message: string;
        result: {
          cards: Card[];
        };
      }
      const response: GetCardsType = await request(`/packs/${id}`, "GET");
      setCards(response.result.cards);
    };

    getCards();
  }, []);

  return (
    <>
      <h2>Pack</h2>
      <ul>
        {cards.map((item, index) => (
          <li key={item.id}>
            #{item.id}
            <br></br>
            {item.numbers.data.map((num, index) => (
              <span key={index}>{num}&nbsp;</span>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Pack;
