import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  GamepadDirectional,
  Gift,
  Grid3x3,
  Plus,
  Loader,
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
import AddCards from "../components/AddCards.tsx";

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
  const [balls, setBalls] = useState<Set<number>>(new Set([171]));
  const [lastBall, setLastBall] = useState<number>(171);
  const [winnings, setWinnings] = useState<Winnings[]>([]);
  const [showWinnings, setShowWinnings] = useState<boolean>(false);
  const [showModalities, setShowModalities] = useState<boolean>(false);
  const [showBallTable, setShowBallTable] = useState<boolean>(false);
  const [showAddCards, setShowAddCards] = useState<boolean>(false);
  const [cardsAdded, setCardsAdded] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);

  const { request } = useFetch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPack = async () => {
      const response: PackType = await request(`/packs/${id}`, "GET");
      if (response.message === "Unauthorized") {
        navigate("/signin");
        return;
      }

      setCards(response.result.cards);
      setPackName(response.result.name);
      setBalls(new Set(response.result.balls.data));
      setWinnings(response.result.winnings);
      setModalities(response.result.modalities.data);
      setAllModalities(response.result.allModalities);
      setLoader(false);
    };
    getPack();
  }, [id, request, cardsAdded, navigate]);

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
  }, [id, modalities, request]);

  useEffect(() => {
    const startTime = Date.now();
    const body: BodyUpdatePack = {};
    if (!balls.has(171)) {
      body.balls = [...balls];
    }
    if (!modalities.includes(171)) {
      body.modalities = modalities;
    }
    body.winnings = winnings;

    request(`/packs/${id}`, "PATCH", {}, body);
    console.log(`Resquest time: ${Date.now() - startTime}ms`);
  }, [request, id, balls, modalities, winnings]);

  const handleSelectBall = useCallback(
    (ball: number) => {
      const startTime = Date.now();
      setLastBall(ball);

      const action: string = balls.has(ball) ? "REMOVE" : "ADD";
      setBalls((prevBalls) => {
        if (prevBalls.has(ball)) {
          return new Set([...prevBalls].filter((b) => b !== ball));
        } else {
          return new Set([...prevBalls, ball]);
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
            cards: new Set(),
          };

          for (const map of modality.map) {
            const mapSet = new Set(map);

            for (const card of cards) {
              const pattern: Set<number> = new Set();

              for (const i of mapSet) {
                if (updatedBalls.has(card.numbers.data[i])) {
                  pattern.add(card.numbers.data[i]);
                }
              }

              if (mapSet.size === pattern.size && pattern.has(ball)) {
                cardsOnModality.cards.add({
                  id: card.id,
                  pattern: pattern,
                  numbers: card.numbers.data,
                });
              }
            }
          }
          if (cardsOnModality.cards.size >= 1) {
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
      console.log(`Select ball time: ${Date.now() - startTime}ms`);
    },
    [balls, allModalities, cards, modalities, winnings],
  );

  const handleDownloadPdf = async () => {
    console.log("Iniciando impressão nativa...");
    window.print();
  };

  return (
    <>
      {showAddCards && (
        <AddCards
          packId={id ? id : ""}
          setShowAddCards={setShowAddCards}
          setCardsAdded={setCardsAdded}
        />
      )}
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
        <div className={styles.div_pack}>
          <div className={styles.div_actions}>
            <button onClick={() => setShowWinnings(true)}>
              <Gift />
            </button>
            <button onClick={() => setShowModalities(true)}>
              <GamepadDirectional />
              Modalidades
            </button>
            <button onClick={handleDownloadPdf}>
              <FileText />
              Exportar
            </button>
            <button
              onClick={() => setShowBallTable(true)}
              disabled={showBallTable}
            >
              <Grid3x3 />
            </button>
            <button onClick={() => setShowAddCards(true)}>
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
          {loader && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
          {!loader && cards.length === 0 && (
            <div className={styles.div_no_cards}>
              <p>Não há cartelas neste maço.</p>
              <button onClick={() => setShowAddCards(true)}>
                <Plus />
              </button>
            </div>
          )}
          <div className={styles.cards}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                index={index + 1}
                id={card.id}
                ball={lastBall}
                balls={balls}
                cardNumbers={card.numbers.data}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pack;
