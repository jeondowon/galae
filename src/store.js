import { DEMO_GROUPS, QUESTIONS } from './questionData.js';
import { REACTIONS, SHIFTS } from './data.js';

export const STORAGE_KEY = 'garae.frontend.v1';
export const STEPS = ['answer', 'result', 'opinions', 'reading', 'reflect', 'done', 'share'];
export const emptyAnswer = () => ({ sel: null, reason: '', submitted: false, shift: null, note: '', savedNote: '', rx: [], completed: false, sharedWith: [], shareDraft: null, lastStep: null });
export const initialState = () => ({ started: false, answers: {}, groups: DEMO_GROUPS, joined: ['g1'] });

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, fallback = '') => typeof value === 'string' ? value : fallback;
const strings = value => Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];

function restoreAnswer(value, id, groups) {
  const answer = isObject(value) ? value : {};
  const sel = QUESTIONS.find(q => q.id === id)?.choices.some(c => c.id === answer.sel) ? answer.sel : null;
  const submitted = answer.submitted === true && sel !== null;
  const shift = Number.isInteger(answer.shift) && answer.shift >= 0 && answer.shift < SHIFTS.length ? answer.shift : null;
  const completed = answer.completed === true && submitted && shift !== null;
  const sharedWith = submitted ? strings(answer.sharedWith).filter(id => groups.some(g => g.id === id)) : [];
  const note = text(answer.note);
  return {
    sel, reason: text(answer.reason), submitted, shift, note, completed, sharedWith,
    // 이전 버전에서 이미 저장·공유한 성찰만 공개용 문장으로 옮깁니다.
    savedNote: Object.hasOwn(answer, 'savedNote') ? text(answer.savedNote) : completed || sharedWith.length ? note : '',
    rx: strings(answer.rx).filter(r => REACTIONS.includes(r)),
    shareDraft: Array.isArray(answer.shareDraft) ? strings(answer.shareDraft).filter(id => groups.some(g => g.id === id)) : null,
    lastStep: STEPS.includes(answer.lastStep) ? answer.lastStep : null,
  };
}

function restoreGroups(value) {
  if (!Array.isArray(value)) return DEMO_GROUPS;
  return value.filter(group => isObject(group) && typeof group.id === 'string' && group.id).map(group => {
    const fallback = DEMO_GROUPS.find(g => g.id === group.id);
    return {
      id: group.id, name: text(group.name, fallback?.name || '이름 없는 그룹'),
      description: text(group.description, fallback?.description), code: text(group.code, fallback?.code),
      color: text(group.color, 'sage'), owner: group.owner === true,
      members: Array.isArray(group.members) ? group.members.filter(m => isObject(m) && typeof m.id === 'string').map(m => ({ id: m.id, name: text(m.name, '멤버'), color: text(m.color, 'sage') })) : fallback?.members || [],
    };
  });
}

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isObject(saved)) {
      const groups = restoreGroups(saved.groups);
      return {
        started: saved.started === true,
        answers: Object.fromEntries(Object.entries(isObject(saved.answers) ? saved.answers : {}).map(([id, answer]) => [id, restoreAnswer(answer, id, groups)])),
        groups,
        joined: strings(saved.joined).filter(id => groups.some(g => g.id === id)),
      };
    }
  } catch { /* 저장 데이터가 없거나 손상되었으면 데모를 새로 시작합니다. */ }
  return initialState();
}

export function updateAnswer(state, id, patch) {
  return { ...state, answers: { ...state.answers, [id]: { ...emptyAnswer(), ...state.answers[id], ...patch } } };
}

export function saveReflection(state, id) {
  const answer = state.answers[id];
  if (!answer?.submitted || answer.shift === null) return state;
  return updateAnswer(state, id, { completed: true, savedNote: answer.note });
}

export function questionStep(answer, requestedStep) {
  if (!answer?.submitted) return 'answer';
  if (requestedStep === 'done' && !answer.completed) return 'reflect';
  return STEPS.includes(requestedStep) ? requestedStep : 'result';
}

export function questionRoute(id, answer) {
  return answer?.completed ? `records/${id}` : `question/${id}/${questionStep(answer, answer?.lastStep)}`;
}

export function rememberQuestionRoute(state, route) {
  const [section, id, requestedStep, ...extra] = route.split('/');
  if (!state.started || section !== 'question' || extra.length || !QUESTIONS.some(q => q.id === id) || (requestedStep && !STEPS.includes(requestedStep))) return state;
  const step = questionStep(state.answers[id], requestedStep);
  return state.answers[id]?.lastStep === step ? state : updateAnswer(state, id, { lastStep: step });
}

export function leaveGroup(state, groupId) {
  return {
    ...state,
    joined: state.joined.filter(id => id !== groupId),
    answers: Object.fromEntries(Object.entries(state.answers).map(([id, answer]) => [id, {
      ...answer,
      sharedWith: answer.sharedWith.filter(g => g !== groupId),
      shareDraft: answer.shareDraft?.filter(g => g !== groupId) ?? null,
    }])),
  };
}
