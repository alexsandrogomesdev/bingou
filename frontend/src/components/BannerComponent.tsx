import { AdMob, BannerAdPosition } from "@capacitor-community/admob";
import { useEffect, type FC } from "react";

const BannerComponent: FC = () => {
  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!isMounted) return;

        await AdMob.showBanner({
          adId: "ca-app-pub-3611957232178140/3353834291",
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
      } catch (e) {
        console.error("Failed to show ads banner:", e);
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
      AdMob.removeBanner().catch((err) => {
        console.log("Failed to remove ads banner:", err);
      });
    };
  }, []);

  return <div className="p-4"></div>;
};

export default BannerComponent;
