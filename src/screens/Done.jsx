import { DoneMotif } from '../motifs.jsx';
import { Icon } from '../components/UI.jsx';

export default function Done({ go, question, answer }) {
  return <div className="flow-content"><div className="done-heading"><span className="done-check"><Icon name="check" size={28} /></span><span className="eyebrow">하나의 갈래를 지나왔어요</span><h2 className="flow-title">생각이 쌓여,<br />나만의 길이 됩니다.</h2><p className="sub">오늘 남긴 마음은 나의 기록에 담아두었어요.</p></div><DoneMotif /><div className="saved-card"><span className="eyebrow">{question.title}</span><h3>{question.choices.find(c => c.id === answer.sel)?.text}</h3><p className="sub">{answer.note || '한 번 더 생각해본 것만으로도 충분해요.'}</p><span className="privacy-label"><Icon name="lock" size={13} />{answer.sharedWith.length ? `${answer.sharedWith.length}개 그룹에 공유 중` : '나에게만 보이는 기록'}</span></div><button className="btn-primary" onClick={() => go('share')}>그룹에 생각 나누기<Icon name="groups" size={18} /></button><button className="btn-outline full" onClick={() => go('records')}>나의 기록 보기</button><button className="text-link centered" onClick={() => go('archive')}>다른 질문도 만나보기<Icon name="arrow" size={16} /></button></div>;
}
