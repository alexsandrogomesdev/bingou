// STYLES
import styles from "./Waiting.module.css";

// HOOKS
import { Loader } from "lucide-react";

// COMPONENTS

const Waiting = ({
  text,
  style = { marginTop: 50 },
}: {
  text: string;
  style?: object;
}) => {
  return (
    <div className={styles.waiting} style={style}>
      <Loader />
      {text}
    </div>
  );
};

export default Waiting;
