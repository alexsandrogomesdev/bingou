import { AdMob, InterstitialAdPluginEvents, BannerAdPosition } from "@capacitor-community/admob";

class AdMobService {
  private isLoaded = false;
  private pendingCallback: (() => void) | null = null;

  constructor() {
    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      console.log("Anúncio intersticial fechado pelo usuário.");

      if (this.pendingCallback) {
        this.pendingCallback();
        this.pendingCallback = null;
      }

      this.loadInterstitial();

      this.restoreBanner();
    });
  }

  async loadInterstitial() {
    try {
      this.isLoaded = false;
      await AdMob.prepareInterstitial({
        adId: "ca-app-pub-3611957232178140/6728780552",
        npa: true,
      });
      this.isLoaded = true;
    } catch (e) {
      this.isLoaded = false;
      console.log("Erro ao carregar intersticial:", e);
    }
  }

  private async restoreBanner() {
    try {
      setTimeout(async () => {
        await AdMob.showBanner({
          adId: "ca-app-pub-3611957232178140/3353834291",
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
        console.log("Banner restaurado após fechar o intersticial.");
      }, 500);
    } catch (e) {
      console.log("Erro ao restaurar banner:", e);
    }
  }

  async showInterstitial(onFinished: () => void) {
    try {
      if (this.isLoaded) {
        this.pendingCallback = onFinished;
        await AdMob.showInterstitial();
      } else {
        onFinished();
        this.loadInterstitial();
      }
    } catch (e) {
      if (this.pendingCallback) {
        this.pendingCallback = null;
      }
      onFinished();
      this.loadInterstitial();
    }
  }
}

export const admobService = new AdMobService();
