import { usePWAInstall } from "../hooks/usePWAInstall";
import styles from "./InstallButton.module.css";

const InstallButton = () => {
  const { isInstallable, installPWA } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button onClick={installPWA} className={styles.button}>
      Instalar Aplicativo
    </button>
  );
};

export default InstallButton;
