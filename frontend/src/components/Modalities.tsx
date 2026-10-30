import { useState, memo } from "react";

// STYLES
import styles from "./Modalities.module.css";
import { X, ToggleRight, ToggleLeft, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

// HOOKS

// COMPONENTS
import NewPattern from "./NewPattern.tsx";
import ModalityPattern from "./ModalityPattern.tsx";
import NewModality from "./NewModality.tsx";

// TYPES
import type { ModalitiesInterface } from "../types/pack";
import { useMainContext } from "../hooks/useMainContext.tsx";
interface Props {
  setShowModalities: React.Dispatch<React.SetStateAction<boolean>>;
  modalities: ModalitiesInterface[];
  setModalities: React.Dispatch<React.SetStateAction<ModalitiesInterface[]>>;
}
interface Modality {
  id: number;
  on: boolean;
  name: string;
  ballLimit?: number;
  maps: Array<number[]>;
}
const Modalities = ({ setShowModalities, modalities, setModalities }: Props) => {
  const { showAds } = useMainContext();
  const [modalityToRemove, setModalityToRemove] = useState<Modality | null>(null);

  const [showNewPattern, setShowNewPattern] = useState<boolean>(false);
  const [modalityId, setModalityId] = useState<number>(0);
  const handleShowNewPattern = (modality: number) => {
    setModalityId(modality);
    setShowNewPattern(true);
    return;
  };

  const changeModality = (modality: number, on: boolean) => {
    const modalitiesTemp: ModalitiesInterface[] = [...modalities];
    for (let a = 0; a < modalitiesTemp.length; a++) {
      if (modalitiesTemp[a].id === modality) {
        modalitiesTemp[a].on = on;
        break;
      }
    }
    setModalities(modalitiesTemp);
    return;
  };
  const changeMap = (modality: number, index: number, on: number) => {
    const modalitiesTemp: ModalitiesInterface[] = [...modalities];
    let changed: boolean = false;
    for (let a = 0; a < modalitiesTemp.length; a++) {
      if (modalitiesTemp[a].id === modality) {
        for (let b = 0; b < modalitiesTemp[a].maps.length; b++) {
          if (b === index) {
            changed = true;
            modalitiesTemp[a].maps[b][0] = on;
            break;
          }
        }
        if (changed === true) break;
      }
    }
    setModalities(modalitiesTemp);
    return;
  };

  const [openId, setOpenId] = useState<number>(0);
  const [showNewModality, setShowNewModality] = useState<boolean>(false);

  const removeModality = () => {
    setModalities((prevModalities) => {
      return prevModalities.filter((m) => m.id !== modalityToRemove?.id);
    });
    setModalityToRemove(null);
    return;
  };
  return (
    <>
      {showNewPattern && (
        <NewPattern
          modality={modalityId}
          setShowNewPattern={setShowNewPattern}
          modalities={modalities}
          setModalities={setModalities}
        />
      )}

      {modalityToRemove !== null && (
        <section className={styles.section_remove_modality}>
          <div className={styles.div_remove_modality}>
            <p>Você quer remover a modalidade: {modalityToRemove.name} ?</p>
            <div>
              <button className={styles.remove_modality_confirm} onClick={removeModality}>
                SIM
              </button>
              <button className={styles.remove_modality_cancel} onClick={() => setModalityToRemove(null)}>
                NÃO
              </button>
            </div>
          </div>
        </section>
      )}
      {showNewModality && <NewModality setShowNewModality={setShowNewModality} setModalities={setModalities} />}
      <section className={styles.section_modalities}>
        <div className={`${styles.div_modalities} ${showAds && styles.div_modalities_with_ads}`}>
          <div className={styles.div_modalities_header}>
            <h3>Modalidades</h3>

            <button className={styles.new_modality} onClick={() => setShowNewModality(true)}>
              <Plus />
            </button>
            <X onClick={() => setShowModalities(false)} />
          </div>
          <ul className={styles.ul_modalities}>
            {modalities.map((modality) => (
              <li key={modality.id} className={`${styles.li_modality} ${modality.on ? styles.modality_on : ""}`}>
                <div>
                  <p>
                    {modality.name} {modality.ballLimit > 0 ? `(até ${modality.ballLimit} bolas)` : ""}
                  </p>
                  <div className={styles.modality_actions}>
                    {modality.on ? (
                      <ToggleRight
                        className={styles.modality_enabled}
                        onClick={() => changeModality(modality.id, false)}
                      />
                    ) : (
                      <ToggleLeft
                        className={styles.modality_disabled}
                        onClick={() => changeModality(modality.id, true)}
                      />
                    )}
                    <Trash2 className={styles.remove_modality} onClick={() => setModalityToRemove(modality)} />
                    {openId === modality.id ? (
                      <ChevronUp className={styles.open_close_modality} onClick={() => setOpenId(0)} />
                    ) : (
                      <ChevronDown className={styles.open_close_modality} onClick={() => setOpenId(modality.id)} />
                    )}
                  </div>
                </div>
                <div className={openId === modality.id ? styles.modality_details_show : styles.modality_details_hide}>
                  {modality.maps.map((item, index) => (
                    <ModalityPattern
                      key={`modality_example_${index}`}
                      modality={modality.id}
                      map={item}
                      index={index}
                      changeMap={changeMap}
                    />
                  ))}
                  <button className={styles.new_pattern} onClick={() => handleShowNewPattern(modality.id)}>
                    <Plus />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default memo(Modalities);
