import { useState } from "react";
import type { CostItem } from "../utils/data";
import { formatMoney } from "../utils/format";

type Props = {
  title: string;
  items: CostItem[];
  onChange: (id: string, amount: number) => void;
};

export default function CostSection({ title, items, onChange }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleChange = (id: string, value: string) => {
    const normalized = value.replace(",", ".");

    if (!/^\d*\.?\d*$/.test(normalized)) return;

    setDrafts((prev) => ({ ...prev, [id]: value }));

    if (normalized === "" || normalized === ".") {
      onChange(id, 0);
    } else {
      onChange(id, Number(normalized));
    }
  };

  const handleBlur = (id: string, value: string) => {
    const normalized = value.replace(",", ".");
    const amount = Number(normalized);
    const finalAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0;

    onChange(id, finalAmount);

    setDrafts((prev) => ({
      ...prev,
      [id]:
        finalAmount === 0
          ? ""
          : new Intl.NumberFormat("en-US", {
              maximumFractionDigits: 2,
            }).format(finalAmount),
    }));

    setEditing((prev) => ({ ...prev, [id]: false }));
  };

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
                type="text"
                inputMode="decimal"
                value={
                  editing[item.id]
                    ? drafts[item.id] ?? ""
                    : item.amount === 0
                      ? ""
                      : new Intl.NumberFormat("en-US", {
                          maximumFractionDigits: 2,
                        }).format(item.amount)
                }
                placeholder="—"
                onFocus={() => {
                  setEditing((prev) => ({ ...prev, [item.id]: true }));
                  setDrafts((prev) => ({
                    ...prev,
                    [item.id]: item.amount === 0 ? "" : String(item.amount),
                  }));
                }}
                onChange={(event) => handleChange(item.id, event.target.value)}
                onBlur={(event) => handleBlur(item.id, event.target.value)}
              />
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}