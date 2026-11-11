import { memo, useEffect, useState } from "react";
import styles from "./BannerAds.module.css";
import { AdMob, BannerAdPosition } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

interface Props {
  margin: number;
  top: boolean;
}
const BannerAds = ({ margin, top }: Props) => {
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const renderAd = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isMounted && Capacitor.isNativePlatform()) {
        try {
          await AdMob.showBanner({
            adId: "ca-app-pub-3611957232178140/3353834291",
            position: top ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
            margin: margin,
            npa: false,
            // isTesting: false,
          });
        } catch (error) {
          console.error("Erro ao carregar banner AdMob:", error);
        }
      }
    };

    renderAd();

    const interval = setInterval(() => {
      if (isMounted) {
        setAdKey((prevKey) => prevKey + 1);
      }
    }, 2.5 * 60 * 1000);

    return () => {
      isMounted = false;
      // Remove o banner nativo ao fechar o modal
      clearInterval(interval);
      AdMob.removeBanner().catch(() => {});
    };
  }, [margin, top, adKey]);

  return <div className={styles.div}></div>;
};

export default memo(BannerAds);
