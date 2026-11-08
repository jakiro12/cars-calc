
import type { CostItem } from "./data";

export type Scenario = {
  id: "optimista" | "media" | "pesimista";
  label: string;
  price: number;
};

export type InvestmentReport = {
  investmentName: string;
  date: string;
  saleCosts: CostItem[];
  operatingCosts: CostItem[];
  saleTotal: number;
  operatingTotal: number;
  totalInvestment: number;
  scenarios: {
    id: Scenario["id"];
    label: string;
    price: number;
    profit: number;
    margin: number;
  }[];
};

type ReportInput = {
  investmentName: string;
  saleCosts: CostItem[];
  operatingCosts: CostItem[];
  scenarios: Scenario[];
};

export function createInvestmentReport({
  investmentName,
  saleCosts,
  operatingCosts,
  scenarios,
}: ReportInput): InvestmentReport {
  const saleTotal = saleCosts.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const operatingTotal = operatingCosts.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalInvestment = saleTotal + operatingTotal;

  return {
    investmentName,
    date: new Date().toLocaleDateString("es-AR"),
    saleCosts,
    operatingCosts,
    saleTotal,
    operatingTotal,
    totalInvestment,
    scenarios: scenarios.map((scenario) => {
      const profit = scenario.price - totalInvestment;

      return {
        ...scenario,
        profit,
        margin:
          scenario.price > 0
            ? (profit / scenario.price) * 100
            : 0,
      };
    }),
  };
}
