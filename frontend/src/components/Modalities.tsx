import {
  useState,
  memo,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ButtonHTMLAttributes,
  useRef,
} from "react";

// STYLES
import styles from "./Modalities.module.css";
import { X, ToggleRight, ToggleLeft, ChevronDown, ChevronUp, Plus, Trash2, Check } from "lucide-react";

// HOOKS

// COMPONENTS
import NewPattern from "./NewPattern.tsx";
import ModalityPattern from "./ModalityPattern.tsx";
import NewModality from "./NewModality.tsx";

// TYPES
import type { ModalitiesInterface } from "../types/pack";
import { useMainContext } from "../hooks/useMainContext.tsx";
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
  const { showAds, setAlert } = useMainContext();
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
  const confirmChangesRef = useRef<HTMLButtonElement>(null);
  const confirmChanges = () => {
    if (confirmChangesRef.current) confirmChangesRef.current.disabled = true;
    setModalities(structuredClone(modalitiesTemp));
    setSaveChanges(false);
    setHasChanges(false);
    if (confirmChangesRef.current) confirmChangesRef.current.disabled = false;
    setAlert({
      id: Math.floor(Math.random() * 10),
      type: "success",
      message: "Modalidades alteradas com sucesso.",
    });
  };

  const [pendingChanges, setPendingChanges] = useState<boolean>(false);
  const close = () => {
    if (!hasChanges) {
      setShowModalities(false);
    } else {
      setPendingChanges(true);
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

      {modalityToRemove !== null && (
        <section className={styles.section_alert_modality}>
          <div className={styles.div_alert_modality}>
            <p>Você quer remover a modalidade: {modalityToRemove.name} ?</p>
            <div>
              <button className={styles.alert_modality_confirm} onClick={removeModality}>
                SIM
              </button>
              <button className={styles.alert_modality_cancel} onClick={() => setModalityToRemove(null)}>
                NÃO
              </button>
            </div>
          </div>
        </section>
      )}

      {pendingChanges && (
        <section className={styles.section_alert_modality}>
          <div className={styles.div_alert_modality}>
            <p>Tem alterações que você não salvou, tem certeza que deseja fechar a aba de modalidades ?</p>
            <div>
              <button className={styles.alert_modality_confirm} onClick={() => setShowModalities(false)}>
                SIM
              </button>
              <button className={styles.alert_modality_cancel} onClick={() => setPendingChanges(false)}>
                NÃO
              </button>
            </div>
          </div>
        </section>
      )}

      {saveChanges && (
        <section className={styles.section_alert_modality}>
          <div className={styles.div_alert_modality}>
            <p>Deseja confirmar todas as alterações nas modalidades ?</p>
            <div>
              <button className={styles.alert_modality_confirm} onClick={confirmChanges}>
                SIM
              </button>
              <button className={styles.alert_modality_cancel} onClick={() => setSaveChanges(false)}>
                NÃO
              </button>
            </div>
          </div>
        </section>
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
            <button
              ref={confirmChangesRef}
              className={styles.confirm_changes}
              onClick={() => setSaveChanges(true)}
              disabled={!hasChanges}
            >
              Salvar alterações
            </button>
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
