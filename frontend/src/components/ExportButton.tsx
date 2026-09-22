import { useState, memo } from "react";

// STYLES

// HOOKS
import { exportPDF } from "../utils/exportPDF";

// COMPONENTS
import ProgressBar from "./ProgressBar";
import type { Cards } from "../types/pack";
import { Share2 } from "lucide-react";
import { useMainContext } from "../hooks/useMainContext";
import { admobService } from "../utils/admobService";

interface Props {
  packName: string;
  cards: Cards[];
}
const ExportButton = ({ packName, cards }: Props) => {
  const [exportProgress, setExportProgress] = useState<number>(0);
  const { showAds } = useMainContext();

  const downloadPdf = async () => {
    setExportProgress(0);
    try {
      await exportPDF(cards, (p) => setExportProgress(p), packName);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setExportProgress(0);
    }
  };

  const handleDownloadPdf = async () => {
    if (showAds) {
      await admobService.showInterstitial(() => {
        downloadPdf();
      });
    } else {
      downloadPdf();
    }
  };

  return (
    <>
      {exportProgress > 0 && <ProgressBar title="Gerando PDF, Aguarde..." percent={exportProgress} />}

      <button onClick={handleDownloadPdf} disabled={exportProgress > 0 ? true : false}>
        <Share2 />
        PDF
      </button>
    </>
  );
};

export default memo(ExportButton);
