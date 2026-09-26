import { useState } from 'react';
import { QUESTIONS, dateLabel } from '../questionData.js';
import { Header, Icon, Empty } from '../components/UI.jsx';

export default function Archive({ answers, openQuestion }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('전체');
  const [category, setCategory] = useState('전체 주제');
  const filtered = QUESTIONS.filter(q => (category === '전체 주제' || category === q.category) && (status === '전체' || (status === '답변 완료' ? answers[q.id]?.submitted : !answers[q.id]?.submitted)) && `${q.title} ${q.body}`.includes(query.trim()));
  return <>
    <Header title="질문 모아보기" subtitle="지나간 질문에도 오늘의 나로 답해보세요." />
    <label className="search-field"><Icon name="search" size={19} /><input aria-label="질문 검색" placeholder="어떤 질문을 찾고 계신가요?" value={query} onChange={e => setQuery(e.target.value)} />{query && <button className="btn-text" aria-label="검색어 지우기" onClick={() => setQuery('')}>×</button>}</label>
    <div className="filter-tabs" aria-label="답변 상태">{['전체', '미답변', '답변 완료'].map(s => <button key={s} aria-pressed={s === status} className={s === status ? 'selected' : ''} onClick={() => setStatus(s)}>{s}</button>)}</div>
    <div className="row list-meta"><span className="sub">{filtered.length}개의 갈림길</span><select aria-label="질문 주제" value={category} onChange={e => setCategory(e.target.value)}>{['전체 주제', '정직', '관계', '책임', '나눔'].map(c => <option key={c}>{c}</option>)}</select></div>
    <div className="archive-list">{filtered.map(q => <button className="archive-card" key={q.id} onClick={() => openQuestion(q.id)}><div className="row"><span className="eyebrow">{dateLabel(q.date)} · NO. {q.no}</span><span className={`status ${answers[q.id]?.submitted ? 'answered' : ''}`}>{answers[q.id]?.submitted ? '답변 완료' : '미답변'}</span></div><h2>{q.title}</h2><p className="sub">{q.body}</p><div className="row"><span className="tag">{q.category}</span><span className="text-link">{answers[q.id]?.submitted ? '내 답변 보기' : '생각 남기기'}<Icon name="arrow" size={16} /></span></div></button>)}</div>
    {!filtered.length && <Empty title="조건에 맞는 질문이 없어요" body="다른 단어로 검색하거나 필터를 바꿔보세요." label="필터 초기화" onClick={() => { setQuery(''); setStatus('전체'); setCategory('전체 주제'); }} />}
  </>;
}
