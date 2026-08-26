import { useEffect, useState, memo } from "react";

// STYLES
import styles from "./Randomizer.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext.tsx";

import { sleep, shuffleArray } from "../utils/functions.ts";
import { Play, RotateCcw } from "lucide-react";

// COMPONENTS

const Randomizer = () => {
  const { setHeaderTitle, setHeaderSubTitle, setAlert } = useMainContext();

  useEffect(() => {
    setHeaderTitle("Sorteador");
    setHeaderSubTitle("");
  }, [setHeaderSubTitle, setHeaderTitle]);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  const [lastBall, setLastBall] = useState<number>(() => {
    const raw = localStorage.getItem("lastBall");
    if (!raw) return 0;

    const number = Number(raw);
    return Number.isNaN(number) ? 0 : number;
  });
  const [drawnBalls, setDrawnBalls] = useState<number[]>(() => {
    const raw = localStorage.getItem("drawnBalls");
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    console.log();
    return Array.isArray(parsed) && parsed.every((x) => typeof x === "number") ? parsed : [];
  });
  const [remainingBalls, setRemainingBalls] = useState<number[]>(() => {
    const raw = localStorage.getItem("remainingBalls");
    const full = Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    if (!raw) return shuffleArray(full);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((x) => typeof x === "number") ? parsed : shuffleArray(full);
  });

  useEffect(() => {
    localStorage.setItem("lastBall", lastBall.toString());
  }, [lastBall]);
  useEffect(() => {
    console.log("drawn balls: " + drawnBalls);
    localStorage.setItem("drawnBalls", JSON.stringify(drawnBalls));
  }, [drawnBalls]);
  useEffect(() => {
    localStorage.setItem("remainingBalls", JSON.stringify(remainingBalls));
  }, [remainingBalls]);

  const handleRandom = async () => {
    if (remainingBalls.length === 0) {
      setAlert({
        id: Date.now(),
        type: "error",
        message: "Todas as bolas já foram sorteadas, reinicie o sorteador.",
      });
      return;
    }
    setButtonDisabled(true);
    const interval = setInterval(() => {
      setLastBall(remainingBalls[Math.floor(Math.random() * remainingBalls.length)]);
    }, 100);
    await sleep(2000);
    clearInterval(interval);

    const index = Math.floor(Math.random() * remainingBalls.length);
    const ball = remainingBalls[index];
    setLastBall(ball);
    setDrawnBalls((prevDrawnBalls) => {
      return [...prevDrawnBalls, ball];
    });
    setRemainingBalls((prevRemainingBalls) => {
      return prevRemainingBalls.filter((i) => i !== ball);
    });

    setButtonDisabled(false);
    return;
  };
  const handleReset = () => {
    if (!confirm("O Sorteador será reiniciado. Todas as bolas sorteadas serão perdidas.")) return;
    setLastBall(0);
    setDrawnBalls([]);
    setRemainingBalls(Array.from({ length: 75 }, (_, i) => i + 1).sort(() => Math.random() - 0.5));
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
    <section className={styles.section_randomizer}>
      <div className={styles.div_randomizer}>
        <div className={styles.div_table_numbers}>
          {columns.map((column, index) => (
            <ul key={`column_number_${index}`}>
              {column.map((ball) => (
                <li
                  key={`column_number_${index}_${ball}`}
                  className={`${!remainingBalls.includes(ball) ? styles.selected_number : ""} ${ball === lastBall && !buttonDisabled ? styles.last_ball : ""}`}
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
          <div className={`${styles.way} ${remainingBalls.length === 0 || buttonDisabled ? styles.way_animation : ""}`}>
            <div className={styles.button_drawn}>
              <span>{lastBall === 0 ? <Play width={36} height={36} /> : lastBall}</span>
            </div>
            <div className={styles.button_drawn}>
              <span>{lastBall === 0 ? <Play /> : lastBall}</span>
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};

export default memo(Randomizer);
