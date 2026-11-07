import { formatMoney } from "../utils/format";

type Scenario = {
  id: "optimista" | "media" | "pesimista";
  label: string;
  price: number;
};

type Props = {
  scenarios: Scenario[];
  totalInvestment: number;
  onPriceChange: (id: Scenario["id"], value: number) => void;
};

export default function ProjectionSection({ scenarios, totalInvestment, onPriceChange }: Props) {
  return (
    <section className="panel projection-panel">
      <div className="scenario-heading">
        <h2>Precio de venta proyectado</h2>
        <div className="scenario-labels">
          {scenarios.map((scenario) => <span key={scenario.id}>{scenario.label}</span>)}
        </div>
      </div>

      <div className="scenario-prices">
  {scenarios.map((scenario) => (
    <label className={`scenario-price ${scenario.id}`} key={scenario.id}>
      <span className="currency">$</span>
      <input
        aria-label={`Precio de venta ${scenario.label}`}
        type="text"
        inputMode="decimal"
        value={
          scenario.price === 0
            ? ""
            : new Intl.NumberFormat("en-US").format(scenario.price)
        }
        placeholder="—"
        onChange={(event) => {
          const value = event.target.value.replace(/,/g, "");
          onPriceChange(scenario.id, Math.max(0, Number(value) || 0));
        }}
      />
    </label>
  ))}
</div>

      <h3 className="profit-title">Utilidad proyectada</h3>
      <div className="profit-grid">
        {scenarios.map((scenario) => {
          const profit = scenario.price - totalInvestment;
          return (
            <div className={`profit-cell ${profit < 0 ? "negative" : ""}`} key={scenario.id}>
              <div className="profit-amount">
                <span>{profit < 0 ? "-$" : "$"}</span>
                <strong>{formatMoney(Math.abs(profit))}</strong>
              </div>
              <div className="profit-margin">
                {scenario.price > 0 ? `${((profit / scenario.price) * 100).toFixed(1)}%` : "—"}
              </div>
            </div>
          );
        })}
      </div>
      <p className="helper-text">La utilidad es el precio de venta menos la inversión total.</p>
    </section>
  );
}