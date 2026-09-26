import { SHIFTS } from '../data.js';
import { Icon } from '../components/UI.jsx';

export default function Reflect({ shift, note, onChange, onComplete }) {
  return <div className="flow-content"><span className="eyebrow">나의 성찰</span><h2 className="flow-title">다른 생각을 만난 뒤,<br />내 마음은 어떤가요?</h2><div className="stack">{SHIFTS.map((s, i) => <button key={s} className={`pill ${shift === i ? 'on' : ''}`} aria-pressed={shift === i} onClick={() => onChange({ shift: i })}>{s}{shift === i && <Icon name="check" size={17} />}</button>)}</div><label className="field-label" htmlFor="reflection">기억하고 싶은 생각 <span>선택</span></label><textarea id="reflection" className="note-input" rows={4} maxLength={500} placeholder="마음에 남은 문장이나 내 선택의 이유를 남겨보세요." value={note} onChange={e => onChange({ note: e.target.value })} /><div className="row"><span className="hint">초안은 나에게만 자동 저장돼요.</span><span className="hint">{note.length}/500</span></div><button className="btn-primary" disabled={shift === null} onClick={onComplete}>성찰 저장하기<Icon name="check" size={18} /></button><p className="footnote">생각이 달라졌는지 선택하면 저장할 수 있어요.<br />공유 중인 성찰은 이 버튼을 눌러야 그룹에도 반영돼요.</p></div>;
}
