import { useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { exportCalculatorPdf } from '../utils/exportCalculatorPdf';

type Concept = { id: number; name: string; amount: number };
type ScenarioKey = 'optimista' | 'media' | 'pesimista';

const SCENARIOS: { key: ScenarioKey; label: string }[] = [
  { key: 'optimista', label: 'Optimista' },
  { key: 'media', label: 'Media' },
  { key: 'pesimista', label: 'Pesimista' },
];

const EMPTY_PRICES: Record<ScenarioKey, string> = { optimista: '', media: '', pesimista: '' };

const currency = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });
const decimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

const toNumber = (value: string) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

const EditIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M6 6l1 14h10l1-14" />
  </svg>
);

export default function InvestmentCalculator() {
  const [vehicleName, setVehicleName] = useState('');
  const [purchase, setPurchase] = useState('');
  const [days, setDays] = useState('');
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [conceptName, setConceptName] = useState('');
  const [conceptAmount, setConceptAmount] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<ScenarioKey, string>>(EMPTY_PRICES);
  const nextId = useRef(1);

  const conceptsTotal = useMemo(
    () => concepts.reduce((sum, c) => sum + c.amount, 0),
    [concepts]
  );
  const purchaseValue = toNumber(purchase);
  const investment = purchaseValue + conceptsTotal; // A + B
  const daysValue = toNumber(days);

  const results = SCENARIOS.map(({ key, label }) => {
    const hasPrice = prices[key] !== '';
    const profit = hasPrice ? toNumber(prices[key]) - investment : null;
    const roi = profit !== null && investment > 0 ? (profit / investment) * 100 : null;
    const perDay = profit !== null && daysValue > 0 ? profit / daysValue : null;
    return { key, label, profit, roi, perDay };
  });

  const resetConceptForm = () => {
    setEditingId(null);
    setConceptName('');
    setConceptAmount('');
  };

  const saveConcept = () => {
    const name = conceptName.trim();
    const amount = parseFloat(conceptAmount);
    if (!name || !Number.isFinite(amount) || amount < 0) return;

    if (editingId !== null) {
      setConcepts((prev) => prev.map((c) => (c.id === editingId ? { ...c, name, amount } : c)));
    } else {
      setConcepts((prev) => [...prev, { id: nextId.current++, name, amount }]);
    }
    resetConceptForm();
  };

  const startEdit = (concept: Concept) => {
    setEditingId(concept.id);
    setConceptName(concept.name);
    setConceptAmount(String(concept.amount));
  };

  const removeConcept = (id: number) => {
    setConcepts((prev) => prev.filter((c) => c.id !== id));
    if (editingId === id) resetConceptForm();
  };

  const clearAll = () => {
    setVehicleName('');
    setPurchase('');
    setDays('');
    setConcepts([]);
    setPrices(EMPTY_PRICES);
    resetConceptForm();
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveConcept();
    }
  };

  const handleExportPdf = () => {
    exportCalculatorPdf({
      investmentName: vehicleName.trim(),
      date: new Date().toLocaleDateString('es-MX'),
      days: daysValue > 0 ? daysValue : null,
      purchase: purchaseValue,
      concepts: concepts.map(({ name, amount }) => ({ label: name, amount })),
      conceptsTotal,
      totalInvestment: investment,
      scenarios: results.map(({ key, label, profit, roi, perDay }) => ({
        label,
        price: prices[key] === '' ? null : toNumber(prices[key]),
        profit,
        roi,
        perDay,
      })),
    });
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">INVERSIÓN</p>
          <h1>Calculadora de inversión</h1>
          <p className="page-description">Importes en pesos mexicanos (MXN)</p>
          <input
            className="name-input"
            type="text"
            placeholder="Ingresa el nombre del vehículo"
            aria-label="Nombre del vehículo"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>

        <div className="investment-card">
          <span>Inversión total</span>
          <strong>{currency.format(investment)}</strong>
          <small>
            Compra {currency.format(purchaseValue)} + Conceptos {currency.format(conceptsTotal)}
          </small>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="cost-column">
          {/* Costo de compra */}
          <section className="panel">
            <div className="panel-heading">
              <h2>Costo de compra</h2>
            </div>
            <div className="cost-list">
              <div className="cost-row">
                <span className="cost-label">Compra</span>
                <label className="amount-field">
                  <span>$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="—"
                    aria-label="Costo de compra"
                    value={purchase}
                    onChange={(e) => setPurchase(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Conceptos */}
          <section className="panel">
            <div className="panel-heading">
              <h2>Conceptos</h2>
              <div className="total-pill">
                <span>$</span>
                <strong>{decimal.format(conceptsTotal)}</strong>
              </div>
            </div>

            <div className="add-concept">
              <input
                className="concept-input"
                type="text"
                placeholder="Concepto (ej. Pintura, placas)"
                aria-label="Concepto"
                value={conceptName}
                onChange={(e) => setConceptName(e.target.value)}
                onKeyDown={handleEnter}
              />
              <div className="add-row">
                <label className="amount-field add-amount">
                  <span>$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    aria-label="Cantidad del concepto"
                    value={conceptAmount}
                    onChange={(e) => setConceptAmount(e.target.value)}
                    onKeyDown={handleEnter}
                  />
                </label>
                <button type="button" className="pdf-btn" onClick={saveConcept}>
                  {editingId !== null ? 'Guardar' : 'Agregar'}
                </button>
                {editingId !== null && (
                  <button type="button" className="pdf-btn secondary" onClick={resetConceptForm}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>

            <div className="cost-list">
              {concepts.length === 0 && (
                <p className="helper-text">Aún no hay conceptos agregados.</p>
              )}
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  className={`cost-row concept-row${concept.id === editingId ? ' editing' : ''}`}
                >
                  <span className="cost-label">{concept.name}</span>
                  <div className="amount-field">
                    <span className="concept-amount">{currency.format(concept.amount)}</span>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Editar ${concept.name}`}
                      onClick={() => startEdit(concept)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label={`Eliminar ${concept.name}`}
                      onClick={() => removeConcept(concept.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Total de días */}
          <section className="panel">
            <div className="panel-heading">
              <h2>Total de días</h2>
            </div>
            <div className="cost-list">
              <div className="cost-row">
                <span className="cost-label">Días</span>
                <label className="amount-field">
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="—"
                    aria-label="Total de días"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                  <span>días</span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="projection-column">
          <section className="panel projection-panel">
            <div className="scenario-heading">
              <h2>Precio de venta proyectado</h2>
            </div>

            <div className="scenario-labels">
              {SCENARIOS.map(({ key, label }) => (
                <span key={key}>{label}</span>
              ))}
            </div>

            <div className="scenario-prices">
              {SCENARIOS.map(({ key, label }) => (
                <label key={key} className={`scenario-price${key === 'media' ? ' media' : ''}`}>
                  <span>$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="—"
                    aria-label={`Precio de venta ${label.toLowerCase()}`}
                    value={prices[key]}
                    onChange={(e) => setPrices((prev) => ({ ...prev, [key]: e.target.value }))}
                  />
                </label>
              ))}
            </div>

            <h3 className="profit-title">Utilidad proyectada</h3>

            <div className="profit-grid">
              {results.map(({ key, profit, roi, perDay }) => (
                <div
                  key={key}
                  className={`profit-cell${profit !== null && profit < 0 ? ' negative' : ''}`}
                >
                  <div className="profit-amount">
                    {profit === null ? (
                      <strong>—</strong>
                    ) : (
                      <>
                        <span>$</span>
                        <strong>{decimal.format(profit)}</strong>
                      </>
                    )}
                  </div>
                  <div className="profit-margin">
                    <span>
                      <span className="profit-tag">ROI</span>{' '}
                      {roi === null ? '—' : `${percent.format(roi)} %`}
                    </span>
                  </div>
                  <div className="profit-day">
                    <span>
                      <span className="profit-tag">Por día</span>{' '}
                      {perDay === null ? '—' : `$${decimal.format(perDay)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="helper-text">
              Utilidad = precio de venta − inversión total · ROI = utilidad ÷ inversión total ·
              Por día = utilidad ÷ días
            </p>

            <div className="container-btns">
              <button type="button" className="pdf-btn" onClick={handleExportPdf}>
                Generar PDF
              </button>
              <button type="button" className="pdf-btn" onClick={clearAll}>
                Limpiar campos
              </button>
            </div>
          </section>
        </div>
      </div>

      <p className="page-footer">Los importes están expresados en pesos mexicanos (MXN).</p>
    </main>
  );
}