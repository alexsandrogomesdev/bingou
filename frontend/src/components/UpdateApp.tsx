import styles from "./UpdateApp.module.css";
import { useFetch } from "../hooks/useFetch.tsx";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

const UpdateApp = () => {
  const { request } = useFetch();
  const [appUpdated, setAppUpdated] = useState<boolean>(true);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const getAppUpdated = async () => {
      const result: { message: string; appUpdated: boolean } = await request("/appUpdated", "GET");
      setAppUpdated(result.appUpdated);
    };
    getAppUpdated();
  }, [request]);

  const handleUpdateApp = async () => {
    request("/appUpdated", "PATCH", {}, {});
    setAppUpdated(true);
    const link = "https://play.google.com/store/apps/details?id=dev.alexsandrogomes.bingou2";
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  };

  if (appUpdated || !Capacitor.isNativePlatform()) return;

  return (
    <>
      {!appUpdated && (
        <section className={styles.section}>
          <div className={styles.div}>
            <p>Há uma atualização disponível para o aplicativo.</p>
            <button onClick={handleUpdateApp}>Atualizar agora</button>
            <button onClick={() => setAppUpdated(true)}>Atualizar depois</button>
          </div>
        </section>
      )}
    </>
  );
  return;
};

export default UpdateApp;
