import { jsPDF } from "jspdf";

export function serializeSvg(svgEl: SVGSVGElement, includeBgExport: boolean) {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;
  if (!includeBgExport) {
    const images = clone.querySelectorAll("image");
    images.forEach((im) => im.parentNode?.removeChild(im));
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(clone);
}

export async function exportPNG(svgEl: SVGSVGElement, filename: string, includeBgExport: boolean) {
  const svgString = serializeSvg(svgEl, includeBgExport);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svgEl.width.baseVal.value;
      canvas.height = svgEl.height.baseVal.value;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); reject(); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = png;
        a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
        a.click();
        resolve();
      } catch (e) { reject(e); }
      finally { URL.revokeObjectURL(url); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}

export async function exportPDF(svgEl: SVGSVGElement, filename: string, includeBgExport: boolean) {
  const svgString = serializeSvg(svgEl, includeBgExport);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svgEl.width.baseVal.value;
      canvas.height = svgEl.height.baseVal.value;
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); reject(); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(img, 0, 0);
        const png = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: canvas.width > canvas.height ? "landscape" : "portrait", unit: "pt", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageW / canvas.width, pageH / canvas.height);
        const imgW = canvas.width * ratio;
        const imgH = canvas.height * ratio;
        const offsetX = (pageW - imgW) / 2;
        const offsetY = (pageH - imgH) / 2;
        pdf.addImage(png, "PNG", offsetX, offsetY, imgW, imgH);
        pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
        resolve();
      } catch (e) { reject(e); }
      finally { URL.revokeObjectURL(url); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}
