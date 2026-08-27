import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "bingou.alexsandrogomes.dev",
  appName: "bingou",
  webDir: "dist",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    StatusBar: {
      overlaysWebView: true,
    },
    android: {
      adjustMarginsForEdgeToEdge: false,
    },
  },
};

export default config;
