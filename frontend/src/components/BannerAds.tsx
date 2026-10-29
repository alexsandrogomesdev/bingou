import { memo, useEffect } from "react";
import styles from "./BannerAds.module.css";
import { AdMob, BannerAdPosition } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

interface Props {
  margin: number;
  top: boolean;
}
const BannerAds = ({ margin, top }: Props) => {
  useEffect(() => {
    let isMounted = true;

    const renderAd = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (isMounted && Capacitor.isNativePlatform()) {
        try {
          // const position =
          if (top) console.log(top);
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

    return () => {
      isMounted = false;
      // Remove o banner nativo ao fechar o modal
      AdMob.removeBanner().catch(() => {});
    };
  }, []);

  return <div className={styles.div}></div>;
};

export default memo(BannerAds);
