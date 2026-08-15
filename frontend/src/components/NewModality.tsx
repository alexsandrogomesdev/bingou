// STYLES
import styles from "./NewModality.module.css";
import { X } from "lucide-react";

// HOOKS

// COMPONENTS
interface Props {
  setShowNewModality: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewModality = ({ setShowNewModality }: Props) => {
  return (
    <section className={styles.section_new_modality}>
      <div className={styles.div_new_modality}>
        <nav className={styles.div_modalities_header}>
          <p>Nova Modalidade</p>
          <X onClick={() => setShowNewModality(false)} />
        </nav>
        <form>
          <label>Nome da modalidade</label>
          <input type="text" />
        </form>
      </div>
    </section>
  );
};

export default NewModality;
