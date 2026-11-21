import { useEffect, useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import styles from "./InstallButton.module.css";
import { Capacitor } from "@capacitor/core";

type Platform = "android" | "ios" | "other";

const InstallButton = () => {
  const { installPWA } = usePWAInstall();

  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    const getDevice = () => {
      const ua = navigator.userAgent || "";

      if (/android/i.test(ua)) {
        setPlatform("android");
      } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
        setPlatform("ios");
      }
    };

    getDevice();
  }, []);

  const installApp = () => {
    if (platform === "android") {
      const link = "https://play.google.com/store/apps/details?id=dev.alexsandrogomes.bingou2";
      window.open(link, "_blank", "noopener,noreferrer");
    } else if (platform === "ios") {
      installPWA();
    }
    return;
  };

  if (platform === "other" || Capacitor.isNativePlatform()) return;

  return (
    <button onClick={installApp} className={styles.button}>
      {platform === "android" && (
        <svg viewBox="0 0 24 24" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4285F4"
            d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z"
          />
          <path fill="#34A853" d="M5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          <path fill="#FBBC05" d="M17.698 9.509l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491z" />
          <path fill="#EA4335" d="M14.499 12.707l2.302 2.302-10.937 6.333 8.635-8.635z" />
        </svg>
      )}
      {platform === "ios" && (
        <svg viewBox="0 0 24 24" width="26" height="26" fill="black" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
      )}
      Instalar App
    </button>
  );
};

export default InstallButton;
