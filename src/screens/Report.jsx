import { QUESTIONS } from '../questionData.js';
import { Header, Empty } from '../components/UI.jsx';

export default function Report({ answers, go }) {
  const answered = QUESTIONS.filter(q => answers[q.id]?.submitted);
  const completed = answered.filter(q => answers[q.id].completed);
  const categories = ['정직', '관계', '책임', '나눔'];
  return <><Header title="내 생각의 방향" subtitle="나를 평가하지 않고, 남긴 생각을 돌아봐요." back={() => go('records')} /><div className="report-intro"><span className="eyebrow">선택의 발자국</span><h2>{answered.length}개의 질문을<br />함께 생각했어요.</h2><p className="sub">질문 주제별 참여 기록입니다. 성격이나 가치관을 점수로 판단하지 않아요.</p></div>{answered.length ? <><div className="result-list">{categories.map(category => { const count = answered.filter(q => q.category === category).length; return <div className="result-item" key={category}><div className="row"><span>{category}</span><strong>{count}개</strong></div><div className="track"><div className="bar key" style={{ width: `${count / answered.length * 100}%` }} /></div></div>; })}</div><div className="saved-card"><span className="eyebrow">다른 생각을 만난 뒤</span><h3>{completed.filter(q => answers[q.id].shift > 0).length}번, 생각의 변화가 있었어요.</h3><p className="sub">완료한 성찰 {completed.length}개 중 ‘조금 달라졌다’ 또는 ‘많이 달라졌다’를 선택한 횟수예요.</p></div><p className="footnote">아직 경향을 말하기엔 이른 작은 기록이에요.<br />질문마다 달랐던 나의 이유를 살펴보세요.</p></> : <Empty title="아직 살펴볼 선택이 없어요" body="첫 질문에 답하면 참여한 주제를 볼 수 있어요." label="첫 질문 만나기" onClick={() => go('archive')} />}</>;
}
