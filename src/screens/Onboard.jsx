import { useState } from 'react';
import { ONBOARD } from '../data.js';
import { OnboardMotif } from '../motifs.jsx';

const fadeIn = delay => ({ opacity: 0, animation: `scrIn 250ms ease-out ${delay}ms forwards` });

export default function Onboard({ go }) {
  const [step, setStep] = useState(0);
  const last = step === ONBOARD.length - 1;
  const cur = ONBOARD[step];

  return (
    <div className="onboard-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 20 }}>
        <button
          type="button" className="btn-text hint"
          style={{ fontSize: 13, visibility: last ? 'hidden' : 'visible' }}
          onClick={() => go('today')}
        >
          건너뛰기
        </button>
      </div>
      <div className="onboard-body">
        <div style={{ margin: '0 -26px' }}><OnboardMotif step={step} /></div>
        <div key={step}>
          <h1 tabIndex={-1} style={{ margin: '40px 0 0', fontSize: 21, lineHeight: 1.6, letterSpacing: '-0.01em', fontWeight: 500, textWrap: 'pretty', ...fadeIn(520) }}>
            {cur.title}
          </h1>
          <p className="sub" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.8, textWrap: 'pretty', ...fadeIn(580) }}>
            {cur.sub}
          </p>
        </div>
      </div>
      <div className="row">
        <div style={{ display: 'flex', gap: 6 }} aria-label={`${step + 1} / ${ONBOARD.length} 단계`}>
          {ONBOARD.map((_, i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: 3, background: i === step ? 'var(--key)' : 'var(--line)' }} />
          ))}
        </div>
        <button
          type="button" className="btn-primary" style={{ width: 'auto', padding: '13px 26px' }}
          onClick={() => (last ? go('today') : setStep(step + 1))}
        >
          {cur.cta}
        </button>
      </div>
    </div>
  );
}
