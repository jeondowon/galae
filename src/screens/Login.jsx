import { LOGINS } from '../data.js';
import { BrandIcon, SplashMotif } from '../motifs.jsx';

const loginBtn = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
  padding: '16px 0', border: '0.5px solid var(--line)', borderRadius: 12, background: 'transparent',
  color: 'var(--ink)', fontSize: 14, fontWeight: 500,
};

export default function Login({ go }) {
  return (
    <div className="col">
      <div style={{ margin: '36px -28px 0' }}><SplashMotif /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 44 }}>
        <h1 tabIndex={-1} style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em' }}>갈래</h1>
        <div className="sub" style={{ lineHeight: 'normal' }}>하루에 하나, 오늘의 갈림길</div>
      </div>
      <div className="spacer" />
      <div className="stack">
        <button type="button" className="btn-primary" onClick={() => go('onboard')}>갈래 미리 시작하기</button>
        {LOGINS.map(l => (
          <button key={l.icon} type="button" style={loginBtn} disabled title="서버 연결 후 제공됩니다">
            <BrandIcon kind={l.icon} />
            <span>{l.label}</span>
          </button>
        ))}
      </div>
      <div className="hint" style={{ marginTop: 18, textAlign: 'center', lineHeight: 1.6 }}>
        소셜 로그인은 준비 중이에요.
        <br />지금은 로그인 없이 이 브라우저에서 체험할 수 있어요.
      </div>
    </div>
  );
}
