import { useState, memo } from "react";

// STYLES

// HOOKS
import { exportPDF } from "../utils/exportPDF";

// COMPONENTS
import ProgressBar from "./ProgressBar";
import type { Cards } from "../types/pack";
import { Share2 } from "lucide-react";
import { useMainContext } from "../hooks/useMainContext";
import InterstitialAds from "./InterstitialAds";

interface Props {
  packId: string;
  packName: string;
  cards: Cards[];
}
const ExportButton = ({ packId, packName, cards }: Props) => {
  const [showInterstitial, setShowInterstitial] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const { showAds } = useMainContext();

  const downloadPdf = async () => {
    if (showAds && showInterstitial) setShowInterstitial(false);
    setExportProgress(0);
    try {
      await exportPDF(cards, (p) => setExportProgress(p), packName, packId);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setExportProgress(0);
    }
  };

  const handleDownloadPdf = async () => {
    if (showAds) {
      setShowInterstitial(true);
    } else {
      await downloadPdf();
    }
  };

  return (
    <>
      {showInterstitial && (
        <InterstitialAds
          callback={downloadPdf}
          message={"Veja o anúncio para gerar o PDF."}
          close={() => setShowInterstitial(false)}
        />
      )}
      {exportProgress > 0 && <ProgressBar title="Gerando PDF, Aguarde..." percent={exportProgress} />}

      <button onClick={() => handleDownloadPdf()} disabled={exportProgress > 0 ? true : false}>
        <Share2 />
        PDF
      </button>
    </>
  );
};

export default memo(ExportButton);
