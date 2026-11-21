import { useState, memo, type Dispatch, type SetStateAction } from "react";

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
import { useGeneralContext } from "../contexts/GeneralContext.ts";
import Confirm from "./Confirm.tsx";
interface Props {
  setShowModalities: Dispatch<SetStateAction<boolean>>;
  modalities: ModalitiesInterface[];
  setModalities: Dispatch<SetStateAction<ModalitiesInterface[]>>;
}
interface Modality {
  id: number;
  on: boolean;
  name: string;
  ballLimit?: number;
  maps: Array<number[]>;
}
const Modalities = ({ setShowModalities, modalities, setModalities }: Props) => {
  const { setAlert } = useMainContext();
  const { showAds } = useGeneralContext();

  const [modalityToRemove, setModalityToRemove] = useState<Modality | null>(null);

  const [showNewPattern, setShowNewPattern] = useState<boolean>(false);
  const [modalityId, setModalityId] = useState<number>(0);
  const handleShowNewPattern = (modality: number) => {
    setModalityId(modality);
    setShowNewPattern(true);
    return;
  };

  const [openId, setOpenId] = useState<number>(0);
  const [showNewModality, setShowNewModality] = useState<boolean>(false);

  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [modalitiesTemp, setModalitiesTemp] = useState<ModalitiesInterface[]>(() => structuredClone(modalities));

  const changeModality = (modalityId: number, on: boolean) => {
    setModalitiesTemp((prev) => prev.map((item) => (item.id === modalityId ? { ...item, on: on } : item)));
    setHasChanges(true);
    return;
  };

  const changeMap = (modalityId: number, index: number, on: number) => {
    setModalitiesTemp((prev) =>
      prev.map((item) =>
        item.id === modalityId
          ? { ...item, maps: item.maps.map((map, i) => (i === index ? [(map[0] = on), ...map.slice(1)] : map)) }
          : item,
      ),
    );
    setHasChanges(true);
    return;
  };

  const changeBallLimit = (ball: number, id: number) => {
    if (ball > 75) return;
    setModalitiesTemp((prev) => prev.map((item) => (item.id === id ? { ...item, ballLimit: ball } : item)));
    setHasChanges(true);
    return;
  };

  const removeModality = () => {
    setModalitiesTemp((prev) => {
      return prev.filter((m) => m.id !== modalityToRemove?.id);
    });
    setModalityToRemove(null);
    setHasChanges(true);
    return;
  };

  const [saveChanges, setSaveChanges] = useState<boolean>(false);
  const confirmChanges = () => {
    setModalities(structuredClone(modalitiesTemp));
    setSaveChanges(false);
    setHasChanges(false);
    setAlert({
      id: Math.floor(Math.random() * 10),
      type: "success",
      message: "Modalidades alteradas com sucesso.",
    });
    setShowModalities(false);
  };

  const close = () => {
    if (!hasChanges) {
      setShowModalities(false);
    } else {
      setSaveChanges(true);
    }
    return;
  };

  return (
    <>
      {showNewPattern && (
        <NewPattern
          modality={modalityId}
          setShowNewPattern={setShowNewPattern}
          modalitiesTemp={modalitiesTemp}
          setModalitiesTemp={setModalitiesTemp}
          setHasChanges={setHasChanges}
        />
      )}

      {modalityToRemove && (
        <Confirm
          text={`Você quer remover a modalidade: ${modalityToRemove.name} ?`}
          yes={removeModality}
          no={() => setModalityToRemove(null)}
        />
      )}

      {saveChanges && (
        <Confirm
          text={"Salvar todas as alterações feitas nas modalidades ?"}
          yes={confirmChanges}
          no={() => setShowModalities(false)}
          inverse={false}
        />
      )}

      {showNewModality && (
        <NewModality
          setShowNewModality={setShowNewModality}
          setModalitiesTemp={setModalitiesTemp}
          setHasChanges={setHasChanges}
        />
      )}

      <section className={styles.section_modalities}>
        <div className={`${styles.div_modalities} ${showAds && styles.div_modalities_with_ads}`}>
          <div className={styles.div_modalities_header}>
            <h3>Modalidades</h3>
            <button className={styles.new_modality} onClick={() => setShowNewModality(true)}>
              <Plus />
            </button>
            <X onClick={() => close()} />
          </div>
          <ul className={styles.ul_modalities}>
            {modalitiesTemp.map((modality) => (
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
                  <div className={styles.ball_limit}>
                    <label>Até qual bola cantada?</label>
                    <span>Ex: 10, até a décima bola cantada. 0 para desativar.</span>
                    <div>
                      <input
                        type={"text"}
                        inputMode={"numeric"}
                        value={modality.ballLimit}
                        onChange={(e) => changeBallLimit(Number(e.target.value), modality.id)}
                      />
                    </div>
                  </div>
                  <div className={styles.modality_patterns}>
                    <button className={styles.new_pattern} onClick={() => handleShowNewPattern(modality.id)}>
                      <Plus />
                    </button>
                    {modality.maps.map((item, index) => (
                      <ModalityPattern
                        key={`modality_example_${index}`}
                        modality={modality.id}
                        map={item}
                        index={index}
                        changeMap={changeMap}
                      />
                    ))}
                  </div>
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
