import type { CostItem } from "../utils/data";
import { formatMoney } from "../utils/format";


type Props = {
  title: string;
  items: CostItem[];
  onChange: (id: string, amount: number) => void;
};

export default function CostSection({ title, items, onChange }: Props) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="panel cost-panel">
      <header className="panel-heading">
        <h2>{title}</h2>
        <div className="total-pill" aria-label={`Total ${title}: ${formatMoney(total)}`}>
          <span>$</span>
          <strong>{formatMoney(total)}</strong>
        </div>
      </header>

      <div className="cost-list">
        {items.map((item) => (
          <label className="cost-row" key={item.id}>
            <span className="cost-label">{item.label}</span>
            <span className="amount-field">
              <span aria-hidden="true">$</span>
              <input
                aria-label={`Importe de ${item.label}`}
                type="number"
                min="0"
                step="0.01"
                value={item.amount === 0 ? "" : item.amount}
                placeholder="—"
                onChange={(event) => onChange(item.id, Math.max(0, Number(event.target.value) || 0))}
              />
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}