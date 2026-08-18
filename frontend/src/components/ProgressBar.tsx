// STYLES
import styles from "./ProgressBar.module.css";

// COMPONENTS

interface Props {
  title: string;
  percent: number;
}
const ProgressBar = ({ title, percent }: Props) => {
  return (
    <section className={styles.section_progress_bar}>
      <div className={styles.div_progress_bar}>
        <p>{title}</p>
        <div>
          <div
            className={styles.div_progress}
            style={{ width: `${percent}%` }}
          ></div>
          <span>{percent}%</span>
        </div>
      </div>
    </section>
  );
};

export default ProgressBar;
