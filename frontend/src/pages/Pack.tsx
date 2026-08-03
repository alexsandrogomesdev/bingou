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
import WinningCards from "../components/WinningCards.tsx";

// INTERFACES AND TYPES
import type {
  Cards,
  AllModalities,
  Winnings,
  PackType,
  WinningsObject,
} from "../types/pack.ts";

const Pack = () => {
  const mainContext = useMainContext();
  const [cards, setCards] = useState<Cards[]>([]);
  const [modalities, setModalities] = useState<number[]>([]);
  const [allModalities, setAllModalities] = useState<AllModalities[]>([]);
  const [packName, setPackName] = useState<string>("");
  const [balls, setBalls] = useState<number[]>([]);
  const [winnings, setWinnings] = useState<Winnings[]>([]);
  const [showWinnings, setShowWinnings] = useState<boolean>(false);

  const { request } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const getCards = async () => {
      const response: PackType = await request(`/packs/${id}`, "GET");
      setCards(response.result.cards);
      setPackName(response.result.name);
      setBalls(response.result.balls.data);
      setWinnings(response.result.winnings);
      setModalities(response.result.modalities.data);
      setAllModalities(response.result.allModalities);
    };
    getCards();
  }, []);

  const handleSelectBall = (ball: number) => {
    const action: string = balls.includes(ball) ? "REMOVE" : "ADD";

    setBalls((prevBalls) => {
      if (prevBalls.includes(ball)) {
        return prevBalls.filter((b) => b !== ball);
      } else {
        return [...prevBalls, ball];
      }
    });

    const updatedBalls: number[] = [...balls];
    if (action === "REMOVE") {
      const index = updatedBalls.indexOf(ball);
      updatedBalls.splice(index);
    } else if (action === "ADD") {
      updatedBalls.push(ball);
    }

    // CHECK WINNINGS
    const tempWinnings: WinningsObject[] = [];
    for (const modality of allModalities) {
      if (modalities.includes(modality.id)) {
        const cardsOnModality: WinningsObject = {
          modality: {
            id: modality.id,
            name: modality.name,
          },
          cards: [],
        };

        for (const map of modality.map) {
          for (const card of cards) {
            const numbers: number[] = [];
            card.numbers.data.forEach((number, index) => {
              if (map.includes(index)) numbers.push(number);
            });
            if (!numbers.includes(ball)) continue;

            const numbersSelecteds: number[] = numbers.filter((n) =>
              updatedBalls.includes(n),
            );

            if (numbersSelecteds.length === numbers.length) {
              cardsOnModality.cards.push({
                id: card.id,
                pattern: numbers,
                numbers: card.numbers.data,
              });
            }
          }
        }
        if (cardsOnModality.cards.length >= 1) {
          tempWinnings.push(cardsOnModality);
        }
      }
    }

    const updatedWinnings: Winnings[] = [...winnings];
    if (action === "REMOVE") {
      setWinnings((prevWinnings) => {
        return prevWinnings.filter((item) => item.ball !== ball);
      });
      const index = updatedWinnings.findIndex((item) => item.ball === ball);
      updatedWinnings.splice(index, 1);
    } else if (action === "ADD" && tempWinnings.length >= 1) {
      setWinnings((prevWinnings) => {
        return [...prevWinnings, { ball: ball, winnings: tempWinnings }];
      });
      updatedWinnings.push({ ball: ball, winnings: tempWinnings });
      setShowWinnings(true);
    }

    request(
      `/packs/${id}`,
      "PATCH",
      {},
      {
        balls: updatedBalls,
        winnings: updatedWinnings,
      },
    );
  };

  return (
    <>
      {showWinnings && (
        <WinningCards
          balls={balls}
          winnings={winnings}
          setShowWinnings={setShowWinnings}
        />
      )}
      <section className={styles.section_pack}>
        <h2 className={styles.pack_title}>{packName}</h2>
        <br></br>
        {balls && id && (
          <CalledBalls balls={balls} handleSelectBall={handleSelectBall} />
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
    </>
  );
};

export default Pack;
