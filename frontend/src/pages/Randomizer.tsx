import { useEffect, useState, memo, useRef } from "react";

// STYLES
import styles from "./Randomizer.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

import { sleep } from "../utils/functions.ts";
import { Play, RotateCcw } from "lucide-react";
import InterstitialAds from "../components/InterstitialAds.tsx";
import BannerAds from "../components/BannerAds.tsx";
import UpdateApp from "../components/UpdateApp.tsx";
import { useRandomizerContext } from "../hooks/RandomizerContext.ts";

// COMPONENTS

const Randomizer = () => {
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const { setHeaderTitle, setHeaderSubTitle, setAlert, showAds, menuOpen } = useMainContext();

  const { drawnBalls, remainingBalls, lastBall, setDrawnBalls, setRemainingBalls, setLastBall, clearRandomizer } =
    useRandomizerContext();

  const isDrawingRef = useRef<boolean>(false);

  useEffect(() => {
    setHeaderTitle("Sorteador");
    setHeaderSubTitle("");
    window.scrollTo(0, 0);
  }, [setHeaderSubTitle, setHeaderTitle]);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const handleRandom = async () => {
    if (remainingBalls.length === 0 || isDrawingRef.current) return;

    isDrawingRef.current = true;
    setButtonDisabled(true);

    console.log("size: " + remainingBalls.length);

    // ANIMATION
    const interval = setInterval(() => {
      setLastBall(remainingBalls[Math.floor(Math.random() * remainingBalls.length)]);
    }, 100);
    await sleep(750);
    clearInterval(interval);

    // CHOOSE A RANDOM BALL
    const index = Math.floor(Math.random() * remainingBalls.length);

    const ball = remainingBalls[index];
    setLastBall(ball);
    setRemainingBalls(remainingBalls.filter((i) => i !== ball));
    setDrawnBalls([...drawnBalls, ball]);

    const { remainingBalls: updatedRemainingBalls } = useRandomizerContext.getState();
    if (updatedRemainingBalls.length === 0) {
      setAlert({
        id: Date.now(),
        type: "error",
        message: "Todas as bolas já foram sorteadas, reinicie o sorteador.",
      });
    }

    isDrawingRef.current = false;
    setButtonDisabled(false);
    return;
  };

  const resetBalls = async () => {
    clearRandomizer();
    return;
  };
  const handleReset = async () => {
    if (!confirm("O Sorteador será reiniciado. Todas as bolas sorteadas serão perdidas.")) return;

    if (showAds) {
      setShowInterstitial(true);
    } else {
      resetBalls();
    }

    return;
  };

  const columns: number[][] = [[], [], [], [], []];
  for (let c = 0; c < 5; c++) {
    const min = 1 + c * 15;
    const max = 15 + c * 15;
    for (let d = min; d <= max; d++) {
      columns[c].push(d);
    }
  }

  return (
    <>
      {showInterstitial && showAds && (
        <InterstitialAds
          callback={resetBalls}
          message={"Veja o anúncio para resetar o sorteador."}
          close={() => setShowInterstitial(false)}
        />
      )}

      <UpdateApp />

      <section className={styles.section_randomizer}>
        <div className={styles.div_randomizer}>
          <div className={styles.div_table_numbers}>
            {columns.map((column, index) => (
              <ul key={`column_number_${index}`}>
                {column.map((ball) => (
                  <li
                    key={`column_number_${index}_${ball}`}
                    className={`${!remainingBalls.includes(ball) ? styles.selected_number : ""} ${
                      ball === lastBall && !buttonDisabled ? styles.last_ball : ""
                    }`}
                  >
                    {ball}
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <div className={styles.div_actions}>
            <RotateCcw onClick={handleReset} />
          </div>

          <div className={styles.drawn_balls}>
            <p>{drawnBalls.length}/75</p>
            <span>Bolas sorteadas</span>
          </div>

          <ul className={styles.ul_drawn_balls}>
            {drawnBalls.toReversed().map((ball) => (
              <li
                key={`drawn_balls_${ball}`}
                className={`${styles.ball} ${ball === lastBall && !buttonDisabled ? styles.last_ball : ""}`}
              >
                {ball}
              </li>
            ))}
          </ul>

          <button
            className={styles.ball_button}
            onClick={handleRandom}
            disabled={remainingBalls.length === 0 || buttonDisabled ? true : false}
          >
            <div className={`${styles.way} ${buttonDisabled ? styles.way_animation : ""}`}>
              <div className={styles.button_drawn}>
                <span>
                  {lastBall === 0 || remainingBalls.length === 0 ? <Play width={36} height={36} /> : lastBall}
                </span>
              </div>
              <div className={styles.button_drawn}>
                <span>{lastBall === 0 || remainingBalls.length === 0 ? <Play /> : lastBall}</span>
              </div>
            </div>
          </button>
        </div>
      </section>

      {showAds && !menuOpen && <BannerAds margin={0} top={false} />}
    </>
  );
};

export default memo(Randomizer);
