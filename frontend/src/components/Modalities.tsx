import { X, ToggleRight, ToggleLeft } from "lucide-react";

// STYLES
import styles from "./Modalities.module.css";

// HOOKS

// COMPONENTS

// TYPES
import type { AllModalities } from "../types/pack";
interface Props {
  setShowModalities: React.Dispatch<React.SetStateAction<boolean>>;
  allModalities: AllModalities[];
  modalities: number[];
  setModalities: React.Dispatch<React.SetStateAction<number[]>>;
}

const Modalities: React.FC<Props> = ({
  setShowModalities,
  allModalities,
  modalities,
  setModalities,
}) => {
  const changeModality = (modality: number) => {
    setModalities((prevModalities) => {
      if (prevModalities.includes(modality)) {
        return prevModalities.filter((m) => m !== modality);
      } else {
        return [...prevModalities, modality];
      }
    });
  };

  return (
    <section className={styles.section_modalities}>
      <div className={styles.div_modalities}>
        <div className={styles.div_modalities_header}>
          <h3>Modalidades</h3>
          <X onClick={() => setShowModalities(false)} />
        </div>
        <ul className={styles.ul_modalities}>
          {allModalities.map((modality) => (
            <li key={modality.id} className={styles.li_modality}>
              <div>
                <p>{modality.name}</p>
              </div>
              <div>
                {modalities.includes(modality.id) ? (
                  <ToggleRight
                    className={styles.modality_actived}
                    onClick={() => changeModality(modality.id)}
                  />
                ) : (
                  <ToggleLeft
                    className={styles.modality_disabled}
                    onClick={() => changeModality(modality.id)}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Modalities;
