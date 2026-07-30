import { toJpeg, toPng } from "html-to-image";
import jsPDF from "jspdf";

const EXPORT_HIDE_SELECTOR = "[data-export-hide]";

/**
 * Yakalama sırasında çiçeklerin üzerindeki mini araç çubuklarını (sil,
 * boyutlandır, döndür, öne getir) geçici olarak gizler; görüntü/PDF
 * çıktısı temiz kalsın diye. React state'ine dokunmadan doğrudan DOM
 * üzerinde çalışır, bu yüzden Canvas/FlowerItem'a ek prop geçirmeye
 * gerek kalmaz.
 */
function withControlsHidden<T>(node: HTMLElement, fn: () => Promise<T>): Promise<T> {
    const controls = Array.from(node.querySelectorAll<HTMLElement>(EXPORT_HIDE_SELECTOR));
    controls.forEach((el) => {
        el.style.visibility = "hidden";
    });
    return fn().finally(() => {
        controls.forEach((el) => {
            el.style.visibility = "";
        });
    });
}

function downloadDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

const CAPTURE_OPTIONS = {
    pixelRatio: 2.5,
    backgroundColor: "#FFFDF8",
    cacheBust: true,
};

export async function exportBoardAsPng(node: HTMLElement, filename = "ani-panosu.png") {
    const dataUrl = await withControlsHidden(node, () => toPng(node, CAPTURE_OPTIONS));
    downloadDataUrl(dataUrl, filename);
}

export async function exportBoardAsJpeg(node: HTMLElement, filename = "ani-panosu.jpg") {
    const dataUrl = await withControlsHidden(node, () =>
        toJpeg(node, { ...CAPTURE_OPTIONS, quality: 0.95 })
    );
    downloadDataUrl(dataUrl, filename);
}

export async function exportBoardAsPdf(node: HTMLElement, filename = "ani-panosu.pdf") {
    const dataUrl = await withControlsHidden(node, () => toPng(node, CAPTURE_OPTIONS));
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, "PNG", 0, 0, pageWidth, pageHeight);
    pdf.save(filename);
}