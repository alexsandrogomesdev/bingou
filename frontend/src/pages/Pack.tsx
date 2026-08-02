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
  interface AllModalities {
    id: number;
    name: string;
    map: Array<number[]>;
  }

  const [cards, setCards] = useState<Card[]>([]);
  const [modalities, setModalities] = useState<number[]>([]);
  const [allModalities, setAllModalities] = useState<AllModalities[]>([]);
  const [packName, setPackName] = useState<string>("");
  const [balls, setBalls] = useState<number[]>([]);

  const { request } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const getCards = async () => {
      interface PackType {
        message: string;
        result: {
          cards: Card[];
          name: string;
          balls: {
            data: number[];
          };
          modalities: {
            data: number[];
          };
          allModalities: [];
        };
      }
      const response: PackType = await request(`/packs/${id}`, "GET");
      setCards(response.result.cards);
      setPackName(response.result.name);
      setBalls(response.result.balls.data);
      setModalities(response.result.modalities.data);
      setAllModalities(response.result.allModalities);
    };
    getCards();
  }, []);

  const checkAnyCardWins = (lastBall: number, action: string) => {
    const winnersCards = [];
    const updatedBalls: number[] = [...balls];

    if (action === "REMOVE") {
      const index = updatedBalls.indexOf(lastBall);
      updatedBalls.splice(index);
    } else if (action === "ADD") {
      updatedBalls.push(lastBall);
    }

    for (const modality of allModalities) {
      if (modalities.includes(modality.id)) {
        for (const map of modality.map) {
          for (const card of cards) {
            const numbers: number[] = [];
            card.numbers.data.forEach((number, index) => {
              if (map.includes(index)) numbers.push(number);
            });
            if (!numbers.includes(lastBall)) continue;

            const numbersSelecteds: number[] = numbers.filter((n) =>
              updatedBalls.includes(n),
            );

            if (numbersSelecteds.length === numbers.length) {
              winnersCards.push({
                modality: {
                  id: modality.id,
                  name: modality.name,
                },
                card: {
                  id: card.id,
                  numbers: numbers,
                },
                ball: lastBall,
              });
            }
          }
        }
      }
    }
    if (winnersCards.length >= 1) {
      // has card winner ...
    }
  };
  const handleSelectBall = (ball: number) => {
    const action: string = balls.includes(ball) ? "REMOVE" : "ADD";

    setBalls((prevBalls) => {
      if (prevBalls.includes(ball)) {
        return prevBalls.filter((b) => b !== ball);
      } else {
        return [...prevBalls, ball];
      }
    });

    request(
      `/packs/${id}`,
      "PATCH",
      {},
      {
        action: action,
        ball: ball,
        balls: balls,
      },
    );

    checkAnyCardWins(ball, action);
  };

  return (
    <section className={styles.section_pack}>
      <h2 className={styles.pack_title}>{packName}</h2>
      <br></br>
      {balls && id && (
        <CalledBalls
          balls={balls}
          setBalls={setBalls}
          handleSelectBall={handleSelectBall}
        />
      )}
      <br></br>
      <div className={styles.cards}>
        {balls &&
          cards.map((card, index) => (
            <Card
              key={index}
              index={index + 1}
              id={card.id}
              balls={balls}
              cardNumbers={card.numbers.data}
            />
          ))}
      </div>
    </section>
  );
};

export default Pack;
