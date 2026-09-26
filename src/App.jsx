import { useEffect, useRef, useState } from 'react';
import Login from './screens/Login.jsx';
import Onboard from './screens/Onboard.jsx';
import Today from './screens/Today.jsx';
import Archive from './screens/Archive.jsx';
import Question from './screens/Question.jsx';
import Result from './screens/Result.jsx';
import Opinions from './screens/Opinions.jsx';
import Reading from './screens/Reading.jsx';
import Reflect from './screens/Reflect.jsx';
import Done from './screens/Done.jsx';
import Share from './screens/Share.jsx';
import Records from './screens/Records.jsx';
import RecordDetail from './screens/RecordDetail.jsx';
import Report from './screens/Report.jsx';
import { Groups, GroupForm, GroupDetail, GroupMembers } from './screens/Groups.jsx';
import { BottomNav, Header, Empty } from './components/UI.jsx';
import { QUESTIONS, TODAY, dateLabel } from './questionData.js';
import { STORAGE_KEY, STEPS, loadState, emptyAnswer, updateAnswer, saveReflection, questionStep, questionRoute, rememberQuestionRoute, leaveGroup } from './store.js';

const routeFromLocation = () => location.hash.replace(/^#\/?/, '') || 'today';

export default function App() {
  const [state, setState] = useState(loadState);
  const [route, setRoute] = useState(routeFromLocation);
  const [welcome, setWelcome] = useState('login');
  const [storageError, setStorageError] = useState(false);
  const mainRef = useRef(null);
  useEffect(() => {
    const onHashChange = () => setRoute(routeFromLocation());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [state]);
  useEffect(() => {
    if (mainRef.current) { mainRef.current.scrollTop = 0; mainRef.current.querySelector('h1')?.focus({ preventScroll: true }); }
    setState(s => rememberQuestionRoute(s, route));
  }, [route, state.started]);
  function go(next) { if (next !== route) { location.hash = `/${next}`; setRoute(next); } }
  function welcomeGo(next) { if (next === 'onboard') setWelcome('onboard'); else setState(s => ({ ...s, started: true })); }
  function openQuestion(id) { go(questionRoute(id, state.answers[id])); }
  function patch(id, value) { setState(s => updateAnswer(s, id, value)); }
  function createGroup(fields) {
    const id = crypto.randomUUID();
    let code;
    do { code = crypto.randomUUID().replaceAll('-', '').slice(0, 6).toUpperCase(); } while (state.groups.some(g => g.code === code));
    setState(s => ({ ...s, groups: [...s.groups, { ...fields, id, code, owner: true, members: [] }], joined: [...s.joined, id] }));
    go(`groups/${id}/members`);
  }
  const [section, id, requestedStep, extra] = route.split('/');
  let active = section;
  let content;
  if (!state.started) content = welcome === 'login' ? <Login go={welcomeGo} /> : <Onboard go={welcomeGo} />;
  else if (section === 'today' && !id) content = <Today state={state} go={go} openQuestion={openQuestion} />;
  else if (section === 'archive' && !id) content = <Archive answers={state.answers} openQuestion={openQuestion} />;
  else if (section === 'question' && !extra && (!requestedStep || STEPS.includes(requestedStep))) {
    const question = QUESTIONS.find(q => q.id === id);
    active = id === TODAY.id ? 'today' : 'archive';
    if (question) {
      const answer = state.answers[id] || emptyAnswer();
      const step = questionStep(answer, requestedStep);
      const flowGo = next => STEPS.includes(next) ? go(`question/${id}/${next}`) : go(next);
      const previous = STEPS[Math.max(0, STEPS.indexOf(step) - 1)];
      let flow;
      switch (step) {
        case 'answer': flow = <Question question={question} answer={answer} onPick={sel => { if (!answer.submitted) patch(id, { sel }); }} onSubmit={() => { if (answer.sel === null) return; patch(id, { submitted: true }); flowGo('result'); }} />; break;
        case 'result': flow = <Result question={question} sel={answer.sel} go={flowGo} />; break;
        case 'opinions': flow = <Opinions question={question} go={flowGo} rx={answer.rx} onRx={rx => patch(id, { rx })} />; break;
        case 'reading': flow = <Reading question={question} go={flowGo} />; break;
        case 'reflect': flow = <Reflect shift={answer.shift} note={answer.note} onChange={value => patch(id, value)} onComplete={() => { if (answer.shift === null) return; setState(s => saveReflection(s, id)); flowGo('done'); }} />; break;
        case 'done': flow = <Done question={question} answer={answer} go={flowGo} />; break;
        case 'share': flow = <Share key={id} question={question} answer={answer} groups={state.groups.filter(g => state.joined.includes(g.id))} onDraft={shareDraft => patch(id, { shareDraft })} onSave={sharedWith => patch(id, { sharedWith, shareDraft: null })} go={go} />; break;
      }
      content = <><Header title={id === TODAY.id ? '오늘의 갈래' : '지난 갈래'} subtitle={`${dateLabel(question.date)} · ${question.title}`} back={() => step === 'answer' || step === 'share' || step === 'done' ? go(active) : flowGo(previous)} /><ol className="flow-progress" aria-label="답변 진행 단계">{['나의 선택', '다른 생각', '성경의 시선', '나의 성찰'].map((label, i) => { const current = step === 'answer' ? 0 : ['result', 'opinions'].includes(step) ? 1 : step === 'reading' ? 2 : 3; return <li key={label} className={i <= current ? 'reached' : ''} aria-current={current === i ? 'step' : undefined}><span />{label}</li>; })}</ol>{flow}</>;
    }
  } else if (section === 'groups' && !extra) {
    if (!id) content = <Groups state={state} go={go} />;
    else if ((id === 'new' || id === 'join') && !requestedStep) content = <GroupForm key={id} mode={id} state={state} go={go} onCreate={createGroup} onJoin={groupId => { setState(s => ({ ...s, joined: [...s.joined, groupId] })); go(`groups/${groupId}`); }} />;
    else {
      const group = state.groups.find(g => g.id === id && state.joined.includes(id));
      if (group && (!requestedStep || requestedStep === 'members' || QUESTIONS.some(q => q.id === requestedStep))) content = requestedStep === 'members' ? <GroupMembers key={id} group={group} go={go} onLeave={groupId => { setState(s => leaveGroup(s, groupId)); go('groups'); }} /> : <GroupDetail key={`${id}/${requestedStep || ''}`} initialQuestionId={requestedStep} group={group} state={state} go={go} openQuestion={openQuestion} />;
    }
  } else if (section === 'records' && !requestedStep) {
    if (!id) content = <Records answers={state.answers} go={go} openQuestion={openQuestion} />;
    else {
      const question = QUESTIONS.find(q => q.id === id);
      if (question && state.answers[id]?.submitted) content = <RecordDetail question={question} answer={state.answers[id]} groups={state.groups} go={go} />;
    }
  } else if (section === 'report' && !id) { active = 'records'; content = <Report answers={state.answers} go={go} />; }
  if (!content) content = <><Header title="페이지를 찾을 수 없어요" /><Empty title="다른 갈래에서 다시 만나요" body="질문이 없거나 참여하지 않은 그룹일 수 있어요." label="오늘로 돌아가기" onClick={() => go('today')} /></>;

  return <div className={`frame ${state.started ? 'app-frame' : 'welcome-frame'}`}>
    <main ref={mainRef} className={`screen ${state.started ? 'app-screen' : ''}`} id="main-content" key={state.started ? route : welcome}>
      {storageError && <div className="form-error" role="alert">브라우저에 저장하지 못했어요. 새로고침하면 변경 내용이 사라질 수 있어요.</div>}{content}
    </main>{state.started && <BottomNav active={active} go={go} />}
  </div>;
}
