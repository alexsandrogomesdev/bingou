import { useEffect, useState, useCallback, useRef } from "react";
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
  const { setHeaderTitle, setAlert } = useMainContext();
  const [cards, setCards] = useState<Cards[]>([]);
  const [modalities, setModalities] = useState<number[]>([]);
  const [allModalities, setAllModalities] = useState<AllModalities[]>([]);
  const [balls, setBalls] = useState<Set<number>>(new Set([]));
  const [lastBall, setLastBall] = useState<number>();
  const [winnings, setWinnings] = useState<Winnings[]>([]);
  const [showWinnings, setShowWinnings] = useState<boolean>(false);
  const [showModalities, setShowModalities] = useState<boolean>(false);
  const [showBallTable, setShowBallTable] = useState<boolean>(false);
  const [showAddCards, setShowAddCards] = useState<boolean>(false);
  const [cardsAdded, setCardsAdded] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);

  const prevStateRef = useRef({ winnings, balls, modalities });

  const { request } = useFetch();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getPack = async () => {
      const response: PackType = await request(`/packs/${id}`, "GET");
      setLoader(false);
      if (response.message === "Unauthorized") {
        navigate("/signin");
        return;
      } else if (response.message !== "ok") {
        setAlert({
          id: Date.now(),
          type: "error",
          message: response.message,
        });
        return;
      }
      setCards(response.result.cards);
      setHeaderTitle(response.result.name);
      setBalls(new Set(response.result.balls.data));
      setWinnings(response.result.winnings);
      setModalities(response.result.modalities.data);
      setAllModalities(response.result.allModalities);
    };
    getPack();
  }, [id, request, cardsAdded, navigate, setHeaderTitle, setAlert]);

  useEffect(() => {
    const prev = prevStateRef.current;

    const body: BodyUpdatePack = {};

    if (prev.balls !== balls) {
      body.balls = [...balls];
    }
    if (prev.modalities !== modalities) {
      body.modalities = modalities;
    }
    if (prev.winnings !== winnings) {
      body.winnings = winnings;
    }

    if (Object.keys(body).length > 0) {
      request(`/packs/${id}`, "PATCH", {}, body);
    }

    prevStateRef.current = { winnings, balls, modalities };
  }, [request, id, balls, modalities, winnings]);

  useEffect(() => {
    if (showWinnings || showBallTable || showModalities) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showWinnings, showBallTable, showModalities]);
  const handleSelectBall = useCallback(
    (ball: number) => {
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

      const modalitiesLength = modalities.length;
      const cardsLength = cards.length;

      for (let a = 0; a < modalitiesLength; a++) {
        // modality per modality
        if (modalities[a].on === false) continue; // modality off
        const cardsOnModality: WinningsObject = {
          modality: {
            id: modalities[a].id,
            name: modalities[a].name,
          },
          cards: [],
        };

        const maps = modalities[a].maps;
        const mapsLength = maps.length;
        for (let b = 0; b < mapsLength; b++) {
          // map per map
          if (maps[b][0] === 0) continue; // map off
          const map = maps[b];

          for (let c = 0; c < cardsLength; c++) {
            if (!cards[c].numbers.data.includes(ball)) continue;
            const card = cards[c];
            const pattern: number[] = [];
            const mapLength = map.length;
            for (let d = 0; d < mapLength; d++) {
              if (d === 0) continue;
              if (updatedBalls.has(card.numbers.data[map[d]])) {
                pattern.push(card.numbers.data[map[d]]);
              }
            }
            if (mapLength - 1 === pattern.length && pattern.includes(ball)) {
              cardsOnModality.cards.push({
                id: card.id,
                pattern: pattern,
                numbers: card.numbers.data,
              });
            }
          }
        }

        if (cardsOnModality.cards.length > 0) {
          tempWinnings.push(cardsOnModality);
        }
      }

      if (action === "REMOVE") {
        setWinnings((prevWinnings) => {
          return prevWinnings.filter((item) => item.ball !== ball);
        });
      } else if (action === "ADD" && tempWinnings.length >= 1) {
        setWinnings((prevWinnings) => {
          return [...prevWinnings, { ball: ball, winnings: tempWinnings }];
        });
        setTimeout(() => {
          setShowWinnings(true);
        }, 1);
      }

      prevStateRef.current = { winnings, balls, modalities };
    },
    [balls, allModalities, cards, modalities, winnings, prevStateRef],
  );

  const handleDownloadPdf = async () => {
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
          <div
            className={`${styles.cards} ${(showWinnings || showBallTable || showWinnings) && styles.blockScroll}`}
          >
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
