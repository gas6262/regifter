import { useMemo, useState } from 'react';
import { defaultCard, defaultRecipient } from './data/mock';

type Summary = {
  giftAmount: number;
  extraSpend: number;
  leftoverAfterSpend: number;
  eligible: boolean;
};

function computeGiftAmount(balance: number, spendFloor: number): Summary {
  const roundedDown = Math.floor(balance / 5) * 5;
  let giftAmount = roundedDown;

  if (balance - giftAmount < spendFloor) {
    giftAmount = Math.max(0, giftAmount - 5);
  }

  const leftoverAfterSpend = Math.max(0, balance - giftAmount);
  const extraSpend = Math.max(0, balance - leftoverAfterSpend);

  return {
    giftAmount,
    extraSpend,
    leftoverAfterSpend,
    eligible: giftAmount >= 5,
  };
}

const steps = [
  'Scan current gift card balance',
  'Use enough balance to shape a clean regift amount',
  'Send a new Amazon gift card to any recipient',
];

const examples = [12.15, 18.99, 22.4, 36.72, 51.01];

export default function App() {
  const [brand, setBrand] = useState(defaultCard.brand);
  const [balance, setBalance] = useState(defaultCard.openedBalance);
  const [spendFloor, setSpendFloor] = useState(defaultCard.spendFloor);
  const [name, setName] = useState(defaultRecipient.name);
  const [email, setEmail] = useState(defaultRecipient.email);
  const [message, setMessage] = useState(defaultRecipient.message);

  const summary = useMemo(() => computeGiftAmount(balance, spendFloor), [balance, spendFloor]);

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Regift / UI prototype</span>
          <h1>Turn leftover gift card balance into a sendable gift.</h1>
          <p>
            This concept takes an already-opened gift card, guides the user to consume enough of the
            balance, and converts the usable remainder into a fresh Amazon gift card amount.
          </p>
          <div className="hero-actions">
            <button className="primary">Start regifting</button>
            <button className="secondary">View flow details</button>
          </div>
        </div>
        <div className="hero-card glass">
          <div className="stat-label">Projected regift amount</div>
          <div className="stat-value">${summary.giftAmount.toFixed(0)}</div>
          <div className="stat-subtitle">
            Spend ${summary.extraSpend.toFixed(2)} on the original card, keep ${summary.leftoverAfterSpend.toFixed(2)} available for the gift flow.
          </div>
          <div className="mini-chart">
            {examples.map((value) => {
              const item = computeGiftAmount(value, spendFloor);
              return (
                <div key={value} className="mini-bar-wrap">
                  <div className="mini-bar" style={{ height: `${item.giftAmount * 1.2}px` }} />
                  <span>${value.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel glass">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Step 1</span>
              <h2>Current card</h2>
            </div>
            <span className="pill">UI only</span>
          </div>

          <label>
            Brand
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option>Amazon</option>
              <option>Visa</option>
              <option>Target</option>
              <option>Starbucks</option>
            </select>
          </label>

          <label>
            Current opened balance
            <input
              type="number"
              min="0"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
            />
          </label>

          <label>
            Minimum remainder threshold
            <input
              type="number"
              min="0"
              step="1"
              value={spendFloor}
              onChange={(e) => setSpendFloor(Number(e.target.value))}
            />
          </label>

          <div className="calc-box">
            <div className="calc-row"><span>Detected balance</span><strong>${balance.toFixed(2)}</strong></div>
            <div className="calc-row"><span>Suggested new gift card amount</span><strong>${summary.giftAmount.toFixed(0)}</strong></div>
            <div className="calc-row"><span>Amount to use on current card first</span><strong>${Math.max(0, balance - summary.giftAmount).toFixed(2)}</strong></div>
            <div className="calc-row muted"><span>Remainder after shaping</span><strong>${summary.leftoverAfterSpend.toFixed(2)}</strong></div>
          </div>
        </section>

        <section className="panel glass accent">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Step 2</span>
              <h2>Recipient</h2>
            </div>
            <span className="pill success">Ready to send</span>
          </div>

          <label>
            Recipient name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label>
            Recipient email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label>
            Gift note
            <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>

          <div className="gift-preview">
            <div className="gift-card">
              <span className="gift-card-brand">{brand} → Amazon</span>
              <strong>${summary.giftAmount.toFixed(0)} digital gift card</strong>
              <p>To: {name || 'Recipient'} · {email || 'recipient@example.com'}</p>
              <p className="gift-message">“{message || 'Your note appears here.'}”</p>
            </div>
          </div>
        </section>

        <section className="panel glass full-span">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Flow</span>
              <h2>How this concept works</h2>
            </div>
          </div>

          <div className="timeline">
            {steps.map((step, index) => (
              <div key={step} className="timeline-item">
                <div className="timeline-dot">{index + 1}</div>
                <div>
                  <h3>{step}</h3>
                  <p>
                    {index === 0 && 'User enters or scans the current balance from a partially used gift card.'}
                    {index === 1 && 'The UI computes the largest giftable amount in $5 increments while preserving a minimum threshold.'}
                    {index === 2 && 'Recipient details and preview are collected for a new outbound Amazon gift card.'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="disclaimer">
            <strong>Product assumption:</strong> I interpreted your rule as “round the giftable remainder down to the nearest $5, but if that would leave less than $2 difference, drop by another $5.” We can change that quickly if you meant the inverse spend flow.
          </div>
        </section>
      </main>
    </div>
  );
}
