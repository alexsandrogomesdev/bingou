import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// STYLES
import styles from "./Alert.module.css";

// HOOKS
import { useMainContext } from "../hooks/useMainContext";

// COMPONENTS
type AlertObject = {
  id: number;
  type: string;
  message: string;
};

const Alert = () => {
  const resetAlert: AlertObject = {
    id: 1001,
    type: "",
    message: "",
  };

  const mainContext = useMainContext();
  const id = mainContext.alert.id;
  const type = mainContext.alert.type;
  const message = mainContext.alert.message;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCloseAlert = () => {
    mainContext.setAlert(resetAlert);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  useEffect(() => {
    if (!type && !message) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      mainContext.setAlert(resetAlert);
    }, 5000);
  }, [id]);

  return (
    <>
      {type !== "" && (
        <div
          className={`${styles.alert} ${type === "error" ? styles.alert_error : styles.alert_success}`}
        >
          <p>Rooooooois</p>
          <X onClick={handleCloseAlert} />
        </div>
      )}
    </>
  );
};

export default Alert;
