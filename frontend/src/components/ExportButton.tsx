import { useState, memo } from "react";

// STYLES

// HOOKS
import { exportPDF } from "../utils/exportPDF";

// COMPONENTS
import ProgressBar from "./ProgressBar";
import type { Cards } from "../types/pack";
import { FileText } from "lucide-react";

const ExportButton = ({
  packName,
  cards,
}: {
  packName: string;
  cards: Cards[];
}) => {
  const [exportProgress, setExportProgress] = useState<number>(0);

  const handleDownloadPdf = async () => {
    setExportProgress(0);
    try {
      await exportPDF(cards, (p) => setExportProgress(p), packName);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setExportProgress(0);
    }
  };

  return (
    <>
      {exportProgress > 0 && (
        <ProgressBar title="Gerando PDF, Aguarde..." percent={exportProgress} />
      )}

      <button
        onClick={handleDownloadPdf}
        disabled={exportProgress > 0 ? true : false}
      >
        <FileText />
        Exportar
      </button>
    </>
  );
};

export default memo(ExportButton);
