import { Icon } from '../components/UI.jsx';

export default function Question({ question, answer, onPick, onReason, onSubmit }) {
  return <div className="flow-content">
    <div className="row"><span className="tag">{question.category}</span><span className="eyebrow">NO. {question.no}</span></div>
    <h2 className="question-title">{question.body}</h2>
    <p className="sub">{answer.submitted ? '이미 남긴 선택이에요. 성찰은 언제든 이어 쓸 수 있어요.' : '지금의 마음에 가장 가까운 선택을 골라주세요.'}</p>
    <div className="stack choices">{question.choices.map((c, i) => <button key={c.id} className={`pill choice ${answer.sel === c.id ? 'on' : ''}`} disabled={answer.submitted} aria-pressed={answer.sel === c.id} onClick={() => onPick(c.id)}><span className="choice-letter">{String.fromCharCode(65 + i)}</span><span>{c.text}</span>{answer.sel === c.id && <Icon name="check" size={18} />}</button>)}</div>
    <label className="field-label" htmlFor="choice-reason">이렇게 선택한 이유 <span>선택</span></label>
    <textarea id="choice-reason" className="note-input" rows={3} maxLength={500} placeholder="다른 사람의 생각을 보기 전, 지금 내 생각을 남겨보세요." value={answer.reason} readOnly={answer.submitted} onChange={e => onReason(e.target.value)} aria-describedby="choice-reason-help" />
    <div className="row"><span id="choice-reason-help" className="hint">{answer.submitted ? '제출한 이유는 처음 생각 그대로 보관돼요.' : '초안은 자동 저장돼요. 제출 후에는 수정할 수 없어요.'}</span><span className="hint">{answer.reason.length}/500</span></div>
    <div className="soft-note"><Icon name="leaf" size={19} /><p>어떤 선택에도 이유가 있어요.<br />다른 생각은 내 선택을 남긴 뒤에 만나요.</p></div>
    <div className="flow-action"><button className="btn-primary" disabled={answer.sel === null} onClick={onSubmit}>{answer.submitted ? '결과 다시 보기' : '내 선택 제출하기'}<Icon name="arrow" size={18} /></button><p className="footnote">답변은 나에게만 저장돼요. 그룹 공유는 직접 선택해요.</p></div>
  </div>;
}
