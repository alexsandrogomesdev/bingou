import { memo } from "react";
import styles from "./Confirm.module.css";

interface Props {
  text: string;
  yes: () => void;
  no: () => void;
  inverse?: boolean;
}
const Confirm = ({ text, yes, no, inverse = true }: Props) => {
  return (
    <section className={styles.section}>
      <div className={styles.div}>
        <p>{text}</p>
        <div>
          <button className={`${inverse ? styles.cancel : styles.confirm}`} onClick={yes}>
            SIM
          </button>
          <button className={`${!inverse ? styles.cancel : styles.confirm}`} onClick={no}>
            NÃO
          </button>
        </div>
      </div>
    </section>
  );
};

export default memo(Confirm);
