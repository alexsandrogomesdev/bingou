import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GamepadDirectional, Gift, Grid3x3, Plus, Loader } from "lucide-react";

// STYLES
import styles from "./Pack.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";
import { useFetch } from "../hooks/useFetch.tsx";

// FUNCTIONS
import { getCardsToRender } from "../utils/getCardsToRender.ts";

// COMPONENTS
import Card from "../components/Card.tsx";
import BallTable from "../components/BallTable.tsx";
import WinningCards from "../components/WinningCards.tsx";
import Modalities from "../components/Modalities.tsx";
import AddCards from "../components/AddCards.tsx";
import ExportButton from "../components/ExportButton.tsx";

// INTERFACES AND TYPES
import type {
  Cards,
  ModalitiesInterface,
  Winnings,
  PackType,
  WinningsObject,
  BodyUpdatePack,
  Goods,
} from "../types/pack.ts";

const Pack = () => {
  const { setHeaderTitle, setHeaderSubTitle, setAlert } = useMainContext();

  const [cards, setCards] = useState<Cards[]>([]);
  const [cardsToRender, setCardsToRender] = useState<Cards[]>([]);

  const [packName, setPackName] = useState<string>("");
  const [modalities, setModalities] = useState<ModalitiesInterface[]>([]);
  const [balls, setBalls] = useState<Set<number>>(new Set([]));
  const [ballsToRender, setBallsToRender] = useState<Set<number>>(new Set([]));
  const [lastBall, setLastBall] = useState<number>(0);
  const [winnings, setWinnings] = useState<Winnings[]>([]);
  const [showWinnings, setShowWinnings] = useState<boolean>(false);
  const [showModalities, setShowModalities] = useState<boolean>(false);
  const [showBallTable, setShowBallTable] = useState<boolean>(false);
  const [showAddCards, setShowAddCards] = useState<boolean>(false);
  const [cardsAdded, setCardsAdded] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [goods, setGoods] = useState<Goods[]>([]);
  const [cardsWithGoods, setCardsWithGoods] = useState<Set<number>>(
    new Set([]),
  );

  const prevStateRef = useRef({ winnings, balls, modalities, goods });

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

      const _cardsToRender: Cards[] = await getCardsToRender(
        response.result.cards,
        response.result.goods,
      );
      setCardsToRender(_cardsToRender);
      setPackName(response.result.name);
      setHeaderTitle(response.result.name);
      setBalls(new Set(response.result.balls.data));
      setBallsToRender(new Set(response.result.balls.data));
      setGoods(response.result.goods);
      setCardsWithGoods(
        new Set(response.result.goods.map((item) => item.card)),
      );
      setWinnings(response.result.winnings);
      setModalities(response.result.modalities);
    };
    getPack();
  }, [id, request, cardsAdded, navigate, setHeaderTitle, setAlert]);

  useEffect(() => {
    setHeaderSubTitle(`${cards.length} cartelas`);
  }, [cards, setHeaderSubTitle]);

  useEffect(() => {
    const updateCardsToRender = async () => {
      const _cardsToRender: Cards[] = await getCardsToRender(cards, goods);
      setCardsToRender(_cardsToRender);
    };

    updateCardsToRender();
  }, [setCardsToRender, goods, cards, balls]);

  useEffect(() => {
    const prev = prevStateRef.current;

    const body: BodyUpdatePack = {};

    if (prev.balls !== balls) {
      body.balls = [...balls];
    }
    if (prev.modalities !== modalities) {
      body.modalities = modalities;
    }
    if (prev.goods !== goods) {
      body.goods = goods;
      setCardsWithGoods(new Set(goods.map((item) => item.card)));
    }
    if (prev.winnings !== winnings) {
      body.winnings = winnings;
    }

    if (Object.keys(body).length > 0) {
      request(`/packs/${id}`, "PATCH", {}, body);
    }

    prevStateRef.current = { winnings, balls, modalities, goods };
  }, [request, id, balls, goods, modalities, winnings]);

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
    async (ball: number) => {
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
      const goodBalls: Goods[] = [];

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
            // if (!cards[c].numbers.data.includes(ball)) continue; // the card has not the ball
            const card = cards[c];
            const pattern: number[] = [];
            const mapLength = map.length;
            for (let d = 1; d < mapLength; d++) {
              if (updatedBalls.has(card.numbers.data[map[d]])) {
                pattern.push(card.numbers.data[map[d]]);
              }
            }
            if (mapLength - 1 === pattern.length && pattern.includes(ball)) {
              // wins
              // -1 because the first index is the control 0 or 1
              cardsOnModality.cards.push({
                id: card.id,
                pattern: pattern,
                numbers: card.numbers.data,
              });
            } else if (mapLength - 1 - pattern.length === 1) {
              // good, miss 1 ball to win
              for (let e = 1; e < mapLength; e++) {
                if (!updatedBalls.has(card.numbers.data[map[e]])) {
                  goodBalls.push({
                    ball: card.numbers.data[map[e]],
                    modality: modalities[a].name,
                    card: cards[c].id,
                  });
                }
              }
            }
          }
        }

        if (cardsOnModality.cards.length > 0) {
          tempWinnings.push(cardsOnModality);
        }
      }

      setGoods(goodBalls);

      // console.log("Good balls: " + goodBalls.map((item) => item.ball));

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
          setShowBallTable(false);
        }, 1);
      }

      setTimeout(() => {
        setBallsToRender(updatedBalls);
      }, 100);

      prevStateRef.current = { winnings, balls, modalities, goods };
    },
    [
      balls,
      cards,
      modalities,
      goods,
      winnings,
      prevStateRef,
      setGoods,
      setBallsToRender,
    ],
  );

  const handleRemoveCard = useCallback(
    async (id: number): Promise<boolean> => {
      if (!confirm(`A cartela (${id}) será removida`)) return false;

      const removeCard: { message: string } = await request(
        `/cards/${id}`,
        "DELETE",
        {},
        {},
      );
      if (removeCard.message === "ok") {
        setAlert({
          id: Date.now(),
          type: "success",
          message: "Cartela removida com sucesso!",
        });
        setCards((prevCards) => {
          return prevCards.filter((card) => card.id !== id);
        });
        return true;
      } else {
        setAlert({
          id: Date.now(),
          type: "error",
          message: "Falha ao remover cartela!",
        });
        return false;
      }
    },
    [request, setAlert],
  );

  const goodsByCard = useMemo(() => {
    const map = new Map<number, Set<number>>();

    for (const item of goods) {
      if (!map.has(item.card)) {
        map.set(item.card, new Set());
      }
      map.get(item.card)!.add(item.ball);
    }
    return map;
  }, [goods]);

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
            <ExportButton cards={cards} packName={packName} />
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
              goods={goods}
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
            className={`${styles.cards} ${(showWinnings || showBallTable || showModalities) && styles.blockScroll}`}
          >
            {cardsToRender.map((card, index) => (
              <Card
                key={card.id}
                index={index + 1}
                id={card.id}
                ball={lastBall}
                balls={ballsToRender}
                cardNumbers={card.numbers.data}
                isGoodCard={cardsWithGoods.has(card.id)}
                goodBalls={goodsByCard.get(card.id) || new Set()}
                handleRemoveCard={handleRemoveCard}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pack;
