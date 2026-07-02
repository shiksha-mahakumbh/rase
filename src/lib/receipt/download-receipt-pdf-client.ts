"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/** Render receipt HTML to a one-page PDF in the browser (matches print layout). */
export async function renderReceiptHtmlToPdfDownload(html: string, filename: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Receipt PDF export");
  iframe.style.cssText =
    "position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;visibility:hidden";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!frameDoc) {
    document.body.removeChild(iframe);
    throw new Error("Could not prepare receipt for download");
  }

  try {
    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    await waitForReceiptFrame(iframe);

    const receipt = frameDoc.querySelector(".receipt") as HTMLElement | null;
    if (!receipt) {
      throw new Error("Receipt layout failed to load");
    }

    const canvas = await html2canvas(receipt, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let renderWidth = maxWidth;
    let renderHeight = (canvas.height * renderWidth) / canvas.width;

    if (renderHeight > maxHeight) {
      renderHeight = maxHeight;
      renderWidth = (canvas.width * renderHeight) / canvas.height;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = margin;

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      x,
      y,
      renderWidth,
      renderHeight,
      undefined,
      "FAST"
    );
    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}

async function waitForReceiptFrame(iframe: HTMLIFrameElement) {
  const win = iframe.contentWindow;
  if (!win) return;

  await new Promise<void>((resolve) => {
    if (win.document.readyState === "complete") {
      resolve();
      return;
    }
    win.addEventListener("load", () => resolve(), { once: true });
  });

  await win.document.fonts?.ready;

  const images = Array.from(win.document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  );

  await new Promise((resolve) => setTimeout(resolve, 250));
}
