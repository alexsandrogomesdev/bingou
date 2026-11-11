import styles from "./UpdateApp.module.css";
import { useFetch } from "../hooks/useFetch.tsx";
import { useEffect, useState } from "react";

const UpdateApp = () => {
  const { request } = useFetch();
  const [appUpdated, setAppUpdated] = useState<boolean>(true);

  useEffect(() => {
    const getAppUpdated = async () => {
      const result: { message: string; appUpdated: boolean } = await request("/appUpdated", "GET");
      setAppUpdated(result.appUpdated);
    };
    getAppUpdated();
  }, []);

  const handleUpdateApp = async () => {
    request("/appUpdated", "PATCH", {}, {});
    setAppUpdated(true);
    const link = "https://play.google.com/store/apps/details?id=dev.alexsandrogomes.bingou2";
    window.open(link, "_blank", "noopener,noreferrer");
    return;
  };
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
