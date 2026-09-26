import { Icon } from '../components/UI.jsx';

export default function Reading({ go, question }) {
  const reading = question.reading;
  return <div className="flow-content"><span className="eyebrow">성경의 시선</span><h2 className="flow-title">잠시 멈추어,<br />다른 빛으로 바라보기</h2><div className="tag-list">{reading.values.map(v => <span className="tag" key={v}>{v}</span>)}</div><p className="reading-body">{reading.body}</p><div className="verse-card"><span className="quote-mark">“</span><p className="serif">{reading.verse}</p><p className="sub">{reading.ref}</p></div><div className="soft-note"><Icon name="leaf" /><p>선택을 평가하는 정답지가 아니에요.<br />나의 판단을 돌아보는 하나의 시선이에요.</p></div><button className="btn-primary" onClick={() => go('reflect')}>나의 생각 돌아보기<Icon name="arrow" size={18} /></button></div>;
}
