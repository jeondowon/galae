import { QUESTIONS, TODAY, SAMPLE_SHARES, dateLabel } from '../questionData.js';
import { Header, Icon, Section, Avatar } from '../components/UI.jsx';
import { DoneMotif } from '../motifs.jsx';

export default function Today({ state, go, openQuestion }) {
  const answer = state.answers[TODAY.id];
  const answered = QUESTIONS.filter(q => state.answers[q.id]?.submitted);
  const groups = state.groups.filter(g => state.joined.includes(g.id));
  return <>
    <Header title="갈래" subtitle="서로 다른 생각, 조금 더 넓어진 나" action={<span className="demo-label">미리보기</span>} />
    <div className="greeting"><span className="eyebrow">{dateLabel(TODAY.date)} 금요일</span><h2>오늘은 어떤 마음의<br />갈림길에 서 있나요?</h2><p className="sub">정답보다 중요한 건, 나만의 이유를 찾는 일.</p></div>
    <section className="today-card">
      <div className="row"><span className="badge">오늘의 질문</span><span className="question-number">NO. {TODAY.no}</span></div>
      <span className="category-label">{TODAY.category} · 친구와 나 사이</span>
      <h2>{TODAY.title}</h2><p>{TODAY.body}</p>
      <DoneMotif />
      <div className="row card-meta"><span>약 3분이면 충분해요</span><span>{answer?.completed ? '성찰 완료 ✓' : answer?.submitted ? '답변 완료 ✓' : '아직 만나지 않은 생각'}</span></div>
      <button className="btn-primary" onClick={() => openQuestion(TODAY.id)}>{answer?.completed ? '나의 기록 보기' : answer?.submitted ? '나의 답변 이어보기' : '오늘의 갈래 시작하기'}<Icon name="arrow" size={18} /></button>
    </section>
    <div className="summary-strip"><div><strong>{answered.length}<small>개</small></strong><span>쌓인 나의 선택</span></div><div><strong>{answered.filter(q => state.answers[q.id].completed).length}<small>개</small></strong><span>남긴 성찰</span></div><div><strong>{groups.length}<small>개</small></strong><span>함께하는 그룹</span></div></div>
    <Section title="함께 걷는 사람들" label="그룹 보기" onClick={() => go('groups')}>
      {groups.length ? groups.slice(0, 2).map(group => <button className="group-preview" key={group.id} onClick={() => go(`groups/${group.id}`)}><Avatar name={group.name} color={group.color} /><span><strong>{group.name}</strong><small>{SAMPLE_SHARES.filter(s => s.groupId === group.id && s.questionId === TODAY.id).length + (answer?.sharedWith.includes(group.id) ? 1 : 0)}명이 오늘의 생각을 나눴어요</small></span><Icon name="arrow" size={17} /></button>) : <button className="group-preview" onClick={() => go('groups/new')}><Icon name="plus" /><span><strong>우리만의 그룹 만들기</strong><small>소중한 사람들과 생각을 나눠보세요.</small></span></button>}
    </Section>
    <Section title="놓쳐도 괜찮아요" label="모든 질문" onClick={() => go('archive')}><p className="sub section-description">지난 갈림길에도, 지금의 생각을 남길 수 있어요.</p>{QUESTIONS.slice(1, 3).map(q => <button className="question-row" key={q.id} onClick={() => openQuestion(q.id)}><span className="date-tile"><small>9월</small>{Number(q.date.slice(8))}</span><span><small>{q.category} · {state.answers[q.id]?.submitted ? '답변 완료' : '답변 기다리는 중'}</small><strong>{q.title}</strong></span><Icon name="arrow" size={16} /></button>)}</Section>
    <p className="footnote">질문·참여 수·다른 사람의 답변은 예시입니다.</p>
  </>;
}
