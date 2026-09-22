import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.alexsandrogomes.bingou",
  appName: "Bingou",
  webDir: "dist",
  server: {
    hostname: "bingou.alexsandrogomes.dev",
    androidScheme: "https",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 6000,
      launchAutoHide: true,
      backgroundColor: "#24af60",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#24af60",
      style: "LIGHT",
    },
    NavigationBar: {
      color: "#24af60",
      lightButtons: true,
      // dividerColor: '#d9d9d9' // Cor da linha divisória (opcional)
    },
  },
};

export default config;
