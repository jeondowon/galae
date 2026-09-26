import { REACTIONS } from '../data.js';
import { Icon } from '../components/UI.jsx';

export default function Opinions({ go, rx, onRx, question }) {
  const toggle = r => onRx(rx.includes(r) ? rx.filter(x => x !== r) : [...rx, r]);
  return <div className="flow-content"><span className="eyebrow">다른 사람들의 생각 · 예시</span><h2 className="flow-title">그 선택에는<br />어떤 이유가 있을까요?</h2><div className="opinion-list">{question.opinions.map((group, i) => <section key={group.label}><div className="opinion-heading"><span className="choice-letter">{String.fromCharCode(65 + i)}</span><h3>{group.label}</h3></div>{group.items.map(item => <blockquote key={item}>{item}</blockquote>)}</section>)}</div><p className="sub">이 생각들을 읽고 어떤 마음이 들었나요?</p><div className="reaction-row">{REACTIONS.map(r => <button key={r} className={`pill ${rx.includes(r) ? 'on' : ''}`} aria-pressed={rx.includes(r)} onClick={() => toggle(r)}>{r}</button>)}</div><button className="btn-primary" onClick={() => go('reading')}>성경의 시선으로 보기<Icon name="arrow" size={18} /></button></div>;
}
