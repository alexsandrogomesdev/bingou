import { memo } from "react";
// import { Sparkles } from "lucide-react";

// STYLES
import styles from "./CardNumber.module.css";

// HOOKS

// COMPONENTS

interface Props {
  number: number;
  isMarked: boolean;
  onPattern: boolean;
  isGoodBall?: boolean;
}
const CardNumber = ({ number, isMarked, onPattern, isGoodBall }: Props) => {
  return (
    <li>
      <span
        className={`${isMarked ? styles.number_selected : ""} ${number === 0 ? styles.joker : ""} ${onPattern ? styles.number_selected_2 : ""} ${isGoodBall ? styles.good_ball : ""}`}
      >
        {number === 0 ? "" : number}
      </span>
    </li>
  );
};

export default memo(CardNumber, (prevProps, nextProps) => {
  return (
    prevProps.isGoodBall !== nextProps.isGoodBall &&
    prevProps.number !== nextProps.number &&
    prevProps.isMarked !== nextProps.isMarked &&
    prevProps.onPattern !== nextProps.onPattern
  );
});
