import useGrow from '../useGrow.js';
import { Icon } from '../components/UI.jsx';

export default function Result({ go, sel, question }) {
  const grown = useGrow();
  return <div className="flow-content">
    <span className="eyebrow">모두의 선택 · 예시 데이터</span><h2 className="flow-title">같은 질문,<br />서로 다른 갈래</h2><p className="sub">{question.title}</p>
    <div className="result-list">{question.choices.map((c, i) => <div key={c.id} className={c.id === sel ? 'result-item mine' : 'result-item'}><div className="row"><span>{c.short}{c.id === sel && <small>나의 선택</small>}</span><strong>{c.pct}%</strong></div><div className="track"><div className={`bar ${c.id === sel ? 'key' : ''}`} style={{ width: grown ? `${c.pct}%` : 0, transitionDelay: `${i * 80}ms` }} /></div></div>)}</div>
    <div className="soft-note"><Icon name="groups" /><p>많이 선택했다고 정답은 아니에요.<br />선택 뒤에 담긴 이유를 만나보세요.</p></div><p className="footnote">{question.participants.toLocaleString()}명의 참여를 가정한 예시입니다.</p>
    <button className="btn-primary" onClick={() => go('opinions')}>다른 사람들의 생각 보기<Icon name="arrow" size={18} /></button>
  </div>;
}
