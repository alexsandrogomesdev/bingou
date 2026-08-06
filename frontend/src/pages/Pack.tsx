import { useEffect, useEffectEvent, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FileText,
  GamepadDirectional,
  Gift,
  Grid3x3,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// STYLES
import styles from "./Pack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// COMPONENTS
import Card from "../components/Card.tsx";
import BallTable from "../components/BallTable.tsx";
import WinningCards from "../components/WinningCards.tsx";
import Modalities from "../components/Modalities.tsx";

// INTERFACES AND TYPES
import type {
  Cards,
  AllModalities,
  Winnings,
  PackType,
  WinningsObject,
  BodyUpdatePack,
} from "../types/pack.ts";

const Pack = () => {
  const { setHeaderTitle } = useMainContext();
  const [cards, setCards] = useState<Cards[]>([]);
  const [modalities, setModalities] = useState<number[]>([171]);
  const [allModalities, setAllModalities] = useState<AllModalities[]>([]);
  const [packName, setPackName] = useState<string>("");
  const [balls, setBalls] = useState<number[]>([171]);
  const [winnings, setWinnings] = useState<Winnings[]>([]);
  const [showWinnings, setShowWinnings] = useState<boolean>(false);
  const [showModalities, setShowModalities] = useState<boolean>(false);
  const [showBallTable, setShowBallTable] = useState<boolean>(true);
  const [ballsToCards, setBallsToCards] = useState<number[]>([]);

  const { request } = useFetch();
  const { id } = useParams();

  useEffect(() => {
    const getPack = async () => {
      const response: PackType = await request(`/packs/${id}`, "GET");
      setCards(response.result.cards);
      setPackName(response.result.name);
      setBalls(response.result.balls.data);
      setWinnings(response.result.winnings);
      setModalities(response.result.modalities.data);
      setAllModalities(response.result.allModalities);
      setBallsToCards(response.result.balls.data);
    };
    getPack();
  }, [id]);

  useEffect(() => {
    setHeaderTitle(packName);
  }, [setHeaderTitle, packName]);

  useEffect(() => {
    if (!modalities.includes(171)) {
      request(
        `/packs/${id}`,
        "PATCH",
        {},
        {
          modalities: modalities,
        },
      );
    }
  }, [id, modalities]);

  useEffect(() => {
    const body: BodyUpdatePack = {};
    if (!balls.includes(171)) {
      body.balls = balls;
    }
    if (!modalities.includes(171)) {
      body.modalities = modalities;
    }
    body.winnings = winnings;

    request(`/packs/${id}`, "PATCH", {}, body);
  }, [request, id, balls, modalities, winnings]);

  const handleSelectBall = (ball: number) => {
    const action: string = balls.includes(ball) ? "REMOVE" : "ADD";
    setBalls((prevBalls) => {
      if (prevBalls.includes(ball)) {
        return prevBalls.filter((b) => b !== ball);
      } else {
        return [...prevBalls, ball];
      }
    });

    const updatedBalls: Set<number> = new Set(balls);
    if (action === "REMOVE") {
      updatedBalls.delete(ball);
    } else if (action === "ADD") {
      updatedBalls.add(ball);
    }

    // CHECK WINNINGS
    const tempWinnings: WinningsObject[] = [];

    for (const modality of allModalities) {
      if (modalities && modalities.includes(modality.id)) {
        const cardsOnModality: WinningsObject = {
          modality: {
            id: modality.id,
            name: modality.name,
          },
          cards: [],
        };

        for (const map of modality.map) {
          const mapSet = new Set(map);

          for (const card of cards) {
            const numbers: number[] = [];

            for (const i of mapSet) {
              if (updatedBalls.has(card.numbers.data[i])) {
                numbers.push(card.numbers.data[i]);
              }
            }

            if (mapSet.size === numbers.length && numbers.includes(ball)) {
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
      setTimeout(() => {
        setShowWinnings(true);
      }, 1);
    }

    setTimeout(() => {
      setBallsToCards([...updatedBalls]);
    }, 1);
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
      {showModalities && (
        <Modalities
          setShowModalities={setShowModalities}
          modalities={modalities}
          setModalities={setModalities}
          allModalities={allModalities}
        />
      )}
      <section className={styles.section_pack}>
        <div className={styles.div_actions}>
          <button onClick={() => setShowWinnings(true)}>
            <Gift />
          </button>
          <button onClick={() => setShowModalities(true)}>
            <GamepadDirectional />
            Modalidades
          </button>
          <button>
            <FileText />
            Exportar
          </button>
          <button
            onClick={() => setShowBallTable(true)}
            disabled={showBallTable}
          >
            <Grid3x3 />
          </button>
          <button>
            <Plus />
          </button>
        </div>

        {balls && id && showBallTable && (
          <BallTable
            balls={balls}
            handleSelectBall={handleSelectBall}
            setShowBallTable={setShowBallTable}
          />
        )}

        <div className={styles.cards}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              index={index + 1}
              id={card.id}
              balls={new Set(balls)}
              cardNumbers={card.numbers.data}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Pack;
