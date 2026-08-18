import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

import type { Cards } from "../types/pack";
import { dateFromUnix } from "./functions";

export const exportPDF = async (
  cards: Cards[],
  progress: (porcentagem: number) => void,
  packName: string,
) => {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const time = dateFromUnix(Math.floor(Date.now() / 1000));

  const lines: Cards[][] = [];
  let lineIndex = 0;
  for (let a = 0; a < cards.length; a++) {
    if (!lines[lineIndex]) {
      lines[lineIndex] = [];
    }

    lines[lineIndex].push(cards[a]);
    if (lines[lineIndex].length === 6) {
      lineIndex++;
    }
  }

  const pages: Cards[][][] = [];
  let pageIndex = 0;
  let atualLine = 0;
  for (let a = 0; a < lines.length; a++) {
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }
    pages[pageIndex].push(lines[a]);
    atualLine++;

    if (atualLine === 6) {
      pageIndex++;
      atualLine = 0;
    }
  }
  pageIndex = pages.length;
  const factor = 100 / pageIndex;

  let cardIndex = 0;

  for (let a = 0; a < pages.length; a++) {
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { height } = page.getSize();

    const cardPage: Cards[][] = pages[a];

    let startY = height - 16; // top start of each line
    let startX = 30;
    page.drawText(`Bingou - Cartelas de bingo. Página ${a + 1}/${pageIndex}`, {
      x: startX,
      y: startY - 5,
      font: fontBold,
      color: rgb(17 / 255, 17 / 255, 17 / 255),
      lineHeight: 16,
      size: 12,
    });
    page.drawText(time, {
      x: startX + 450,
      y: startY - 5,
      font: font,
      color: rgb(17 / 255, 17 / 255, 17 / 255),
      lineHeight: 16,
      size: 10,
    });

    for (let b = 0; b < cardPage.length; b++) {
      startY -= 20;
      const line: Cards[] = cardPage[b];

      for (let c = 0; c < line.length; c++) {
        const card = line[c];
        cardIndex++;

        startX = 30 + c * 90;
        const cellSize = 16;

        page.drawRectangle({
          x: startX,
          y: startY - 110,
          width: 80,
          height: 110,
          borderWidth: 1,
          borderColor: rgb(30 / 255, 30 / 255, 30 / 255),
        });
        page.drawText(`#${cardIndex} (${card.id})`, {
          x: startX + 3,
          y: startY - 10,
          size: 8,
          lineHeight: 14,
          font: font,
        });
        const header: string[] = ["B", "I", "N", "G", "O"];
        let headerX = startX + 5;
        for (let c = 0; c < header.length; c++) {
          page.drawText(header[c], {
            x: headerX,
            y: startY - 26,
            size: 10,
            lineHeight: 14,
            font: fontBold,
          });
          headerX += 16;
        }

        for (let e = 0; e < card.numbers.data.length; e++) {
          const y = startY - 46 - (e % 5) * cellSize;
          const num = card.numbers.data[e];
          const X = String(num).length === 1 ? 6 : 4;

          if (num !== 0) {
            page.drawText(String(num), {
              x: startX + X,
              y: y + 4,
              size: 8,
              font,
            });
          } else {
            const starPath =
              "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z";
            page.drawSvgPath(starPath, {
              x: startX + 2,
              y: y + 14,
              scale: 0.5,
              color: rgb(36 / 255, 175 / 255, 96 / 255),
            });
          }

          if (e === 4 || e === 9 || e === 14 || e === 19) {
            startX += cellSize;
          }
        }
      }

      startY -= 110;
    }

    progress(Math.ceil(a * factor));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const pdfBytes = await pdfDoc.save();

  download(
    pdfBytes,
    `${packName.replaceAll(" ", "_")}_${Date.now()}.pdf`,
    "application/pdf",
  );
};
