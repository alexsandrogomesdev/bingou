import { memo, useEffect, useState } from "react";
import styles from "./InterstitialAds.module.css";
import { AdMob, InterstitialAdPluginEvents } from "@capacitor-community/admob";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { Loader, X } from "lucide-react";

interface Props {
  callback: () => void;
  message: string;
  close: () => void;
}
const InterstitialAds = ({ callback, message, close }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showButtonClose, setShowButtonClose] = useState<boolean>(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const timing = setTimeout(() => {
      setShowButtonClose(true);
    }, 2000);

    return () => {
      clearTimeout(timing);
    };
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let isMounted = true;

    const renderAd = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isMounted) {
        try {
          await AdMob.prepareInterstitial({
            adId: "ca-app-pub-3611957232178140/6728780552",
            npa: false,
          });
          setLoading(false);
          await AdMob.showInterstitial();
        } catch (error) {
          console.error("Erro ao carregar banner AdMob:", error);
        }
      }
    };

    renderAd();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let dismissListener: PluginListenerHandle;
    let failedListener: PluginListenerHandle;

    const setupListeners = async () => {
      dismissListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        setLoading(false);
        if (callback) callback();
      });

      failedListener = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, () => {
        setLoading(false);
      });
    };

    setupListeners();

    return () => {
      if (dismissListener) dismissListener.remove();
      if (failedListener) failedListener.remove();
    };
  }, []);

  const handleClose = () => {
    if (callback) callback();
    close();
  };

  if (!Capacitor.isNativePlatform()) return;
  return (
    <>
      {loading && (
        <section className={styles.section}>
          {showButtonClose && <X className={styles.close} onClick={() => handleClose()} />}
          <div>
            <Loader className={styles.loading} />
            <p>{message}</p>
          </div>
        </section>
      )}
    </>
  );
};

export default memo(InterstitialAds);
