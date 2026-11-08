import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPdf(
  element: HTMLElement,
  fileName: string
) {
const canvas = await html2canvas(element, {
  scale: 2,
  useCORS: true,
  backgroundColor: "#ffffff",
  logging: false,
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
  onclone: (clonedDocument) => {
    const style = clonedDocument.createElement("style");

    style.textContent = `
      * {
        outline: none !important;
        box-shadow: none !important;
      }

      *:focus,
      *:focus-visible,
      *:active {
        outline: none !important;
      }
    `;

    clonedDocument.head.appendChild(style);
  },
});

  const image = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imageWidth = pdfWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  let heightLeft = imageHeight;
  let position = 0;

  pdf.addImage(image, "PNG", 0, position, imageWidth, imageHeight);

  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = heightLeft - imageHeight;

    pdf.addPage();

    pdf.addImage(image, "PNG", 0, position, imageWidth, imageHeight);

    heightLeft -= pdfHeight;
  }

  pdf.save(`${fileName}.pdf`);
}