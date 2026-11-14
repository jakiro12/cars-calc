import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type CalculatorReport = {
  investmentName: string;
  date: string;
  days: number | null;
  purchase: number;
  concepts: { label: string; amount: number }[];
  conceptsTotal: number;
  totalInvestment: number;
  scenarios: {
    label: string;
    price: number | null;
    profit: number | null;
    roi: number | null;
    perDay: number | null;
  }[];
};

const money = (value: number) =>
  `$ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const moneyOrDash = (value: number | null) => (value === null ? "-" : money(value));
const percentOrDash = (value: number | null) => (value === null ? "-" : `${value.toFixed(1)}%`);

const NAVY: [number, number, number] = [35, 45, 65];
const LIGHT: [number, number, number] = [235, 238, 243];

// Estilos compartidos por todas las tablas (mismos que el PDF original)
const baseTable = {
  theme: "grid" as const,
  headStyles: {
    fillColor: NAVY,
    textColor: 255,
    halign: "center" as const,
  },
  footStyles: {
    fillColor: LIGHT,
    textColor: NAVY,
    fontStyle: "bold" as const,
  },
  didParseCell: (data: any) => {
    if (data.section === "foot" && data.column.index === 1) {
      data.cell.styles.halign = "right";
    }
  },
};

export function exportCalculatorPdf(report: CalculatorReport) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const lastY = () => (pdf as any).lastAutoTable.finalY as number;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("REPORTE DE INVERSION", 14, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text(`Inversion: ${report.investmentName || "Sin nombre"}`, 14, 29);
  pdf.text(`Fecha: ${report.date}`, 14, 35);

  let startY = 43;
  if (report.days !== null) {
    pdf.text(`Dias totales: ${report.days}`, 14, 41);
    startY = 49;
  }

  // Conceptos
  autoTable(pdf, {
    ...baseTable,
    startY,
    showHead: "firstPage",
    showFoot: "lastPage",
    head: [["CONCEPTOS", "IMPORTE"]],
    body:
      report.concepts.length > 0
        ? report.concepts.map((item) => [item.label, money(item.amount)])
        : [["Sin conceptos agregados", money(0)]],
    foot: [["TOTAL CONCEPTOS", money(report.conceptsTotal)]],
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  // Resumen de inversion (A + B)
  autoTable(pdf, {
    ...baseTable,
    startY: lastY() + 10,
    head: [["RESUMEN DE INVERSION", "IMPORTE"]],
    body: [
      ["Costo de compra", money(report.purchase)],
      ["Conceptos", money(report.conceptsTotal)],
    ],
    foot: [["INVERSION TOTAL", money(report.totalInvestment)]],
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  // Escenarios
  autoTable(pdf, {
    ...baseTable,
    startY: lastY() + 10,
    head: [["ESCENARIO", "PRECIO DE VENTA", "UTILIDAD", "ROI", "POR DIA"]],
    body: report.scenarios.map((scenario) => [
      scenario.label,
      moneyOrDash(scenario.price),
      moneyOrDash(scenario.profit),
      percentOrDash(scenario.roi),
      moneyOrDash(scenario.perDay),
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  pdf.save(`${report.investmentName || "reporte-inversion"}.pdf`);
}