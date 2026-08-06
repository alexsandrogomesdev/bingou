import { useState, memo } from "react";
import { Globe } from "lucide-react";

// STYLES
import styles from "./CardNumber.module.css";

// HOOKS

// COMPONENTS

interface Props {
  number: number;
  isMarked: boolean;
  onPattern: boolean;
}
const CardNumber = memo(({ number, isMarked, onPattern }: Props) => {
  return (
    <li>
      <span
        className={`${isMarked && styles.number_selected} ${number === 0 && styles.joker} ${onPattern && styles.number_selected_2}`}
      >
        {number === 0 ? <Globe /> : number}
      </span>
    </li>
  );
});

export default CardNumber;
