
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvestmentReport } from "./report";

const money = (value: number) =>
  `$ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function exportPdf(report: InvestmentReport) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("REPORTE DE INVERSION", 14, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  pdf.text(
    `Inversion: ${report.investmentName || "Sin nombre"}`,
    14,
    29
  );

  pdf.text(`Fecha: ${report.date}`, 14, 35);

  autoTable(pdf, {
    startY: 43,
    head: [["COSTOS DE VENTA", "IMPORTE"]],
    body: report.saleCosts.map((item) => [
      item.label,
      money(item.amount),
    ]),
    foot: [["TOTAL COSTOS DE VENTA", money(report.saleTotal)]],
    theme: "grid",
    headStyles: {
      fillColor: [35, 45, 65],
      textColor: 255,
      halign:"center"
    },
    footStyles: {
      fillColor: [235, 238, 243],
      textColor: [35, 45, 65],
      fontStyle: "bold",
    },
     didParseCell: (data) => {
  if (data.section === "foot" && data.column.index === 1) {
    data.cell.styles.halign = "right";
  }
},
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 8,
    showHead:"firstPage",
    showFoot:"lastPage",
    head: [["GASTOS OPERATIVOS", "IMPORTE"]],
    body: report.operatingCosts.map((item) => [
      item.label,
      money(item.amount),
    ]),
    foot: [["TOTAL GASTOS OPERATIVOS", money(report.operatingTotal)]],
    theme: "grid",
    headStyles: {
      fillColor: [35, 45, 65],
      textColor: 255,
      halign:"center"
    },
    footStyles: {
      fillColor: [235, 238, 243],
      textColor: [35, 45, 65],
      fontStyle: "bold",
    },
    didParseCell: (data) => {
  if (data.section === "foot" && data.column.index === 1) {
    data.cell.styles.halign = "right";
  }
},
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  const finalY = (pdf as any).lastAutoTable.finalY + 10;

  autoTable(pdf, {
    startY: finalY,
    head: [["RESUMEN DE INVERSION", "IMPORTE"]],
    body: [
      ["Costos de venta", money(report.saleTotal)],
      ["Gastos operativos", money(report.operatingTotal)],
      ["INVERSION TOTAL", money(report.totalInvestment)],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [35, 45, 65],
      textColor: 255,
      halign:"center"
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      1: { halign: "right" },
    },
  });

  autoTable(pdf, {
    startY: (pdf as any).lastAutoTable.finalY + 10,
    head: [[
      "ESCENARIO",
      "PRECIO DE VENTA",
      "UTILIDAD",
      "MARGEN",
    ]],
    body: report.scenarios.map((scenario) => [
      scenario.label,
      money(scenario.price),
      money(scenario.profit),
      `${scenario.margin.toFixed(1)}%`,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [35, 45, 65],
      textColor: 255,
      halign:"center"
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    columnStyles: {
      1: { halign: "right" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
  });

  pdf.save(
    `${report.investmentName || "reporte-inversion"}.pdf`
  );
}
