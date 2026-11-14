import { useMemo, useState } from "react";
import "../App.css";
import { initialOperatingCosts, initialSaleCosts, type CostItem } from "../utils/data";
import { parseAmount } from "../utils/format";
import CostSection from "../components/CostSection";
import ProjectionSection from "../components/ProjectionSection";
import { createInvestmentReport } from "../utils/report";
import { exportPdf } from "../utils/exportPdf";


type Scenario = {
  id: "optimista" | "media" | "pesimista";
  label: string;
  price: number;
};

const initialScenarios: Scenario[] = [
  { id: "optimista", label: "Optimista", price: 0 },
  { id: "media", label: "Media", price: 0 },
  { id: "pesimista", label: "Pesimista", price: 0 },
];

function updateItem(items: CostItem[], id: string, amount: number) {
  return items.map((item) => item.id === id ? { ...item, amount } : item);
}

function MainScreenCalc() {
  const [saleCosts, setSaleCosts] = useState(initialSaleCosts);
  const [operatingCosts, setOperatingCosts] = useState(initialOperatingCosts);
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [investmentName, setInvestmentName] = useState("");

  const saleTotal = useMemo(
    () => saleCosts.reduce((sum, item) => sum + item.amount, 0),
    [saleCosts]
  );

  const operatingTotal = useMemo(
    () => operatingCosts.reduce((sum, item) => sum + item.amount, 0),
    [operatingCosts]
  );

  const totalInvestment = saleTotal + operatingTotal;

  function updateScenario(id: Scenario["id"], value: number) {
    setScenarios((current) =>
      current.map((scenario) =>
        scenario.id === id
          ? { ...scenario, price: parseAmount(String(value)) }
          : scenario
      )
    );
  }
function clearForm() {
  setInvestmentName("");
  setSaleCosts(initialSaleCosts);
  setOperatingCosts(initialOperatingCosts);
  setScenarios(initialScenarios);
}
  return (
    <main className="app-shell" >
      <header className="page-header">
        <div>
          <h1
            style={{marginLeft:10}}
          >Calculadora de inversión</h1>
          <div className="investment-card">

           <input
              type="text"
              value={investmentName}
              onChange={(event) => setInvestmentName(event.target.value.toLocaleUpperCase())}
              placeholder="Ingresa el nombre del carro"
              aria-label="Ingresa el nombre del carro"
            />
          </div>          
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="cost-column">
          <CostSection
            title="Costos de ventas"
            items={saleCosts}
            onChange={(id, amount) =>
              setSaleCosts((current) => updateItem(current, id, amount))
            }
          />

          <CostSection
            title="Gastos operativos"
            items={operatingCosts}
            onChange={(id, amount) =>
              setOperatingCosts((current) => updateItem(current, id, amount))
            }
          />
        </div>

        <div className="projection-column">
          <div className="investment-card">
           
            <h2 style={{color:'#ffffff'}}>Inversión total</h2>
            <strong>
              <small>$</small>{" "}
              {totalInvestment.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <ProjectionSection
            scenarios={scenarios}
            totalInvestment={totalInvestment}
            onPriceChange={updateScenario}
          />
         <div
         className="container-btns"
         >
           <button
          className="pdf-btn"
           onClick={() => {
    const report = createInvestmentReport({
      investmentName,
      saleCosts,
      operatingCosts,
      scenarios,
    });

    exportPdf(report);
  }}
          >
            Generar PDF
          </button>
          <button onClick={clearForm}
          className="pdf-btn"
          >
  Limpiar campos
</button>
          </div> 
         
        </div>
      </div>
    </main>
  );
}

export default MainScreenCalc;