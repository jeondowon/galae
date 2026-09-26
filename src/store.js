import { DEMO_GROUPS } from './questionData.js';

export const STORAGE_KEY = 'garae.frontend.v1';
export const emptyAnswer = () => ({ sel: null, submitted: false, shift: null, note: '', rx: [], completed: false, sharedWith: [], shareDraft: null });
export const initialState = () => ({ started: false, answers: {}, groups: DEMO_GROUPS, joined: ['g1'] });

export function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.answers && Array.isArray(saved.groups) && Array.isArray(saved.joined)) return {
      ...saved,
      answers: Object.fromEntries(Object.entries(saved.answers).map(([id, answer]) => [id, { ...emptyAnswer(), ...answer }])),
    };
  } catch { /* 저장 데이터가 없거나 손상되었으면 데모를 새로 시작합니다. */ }
  return initialState();
}

export function updateAnswer(state, id, patch) {
  return { ...state, answers: { ...state.answers, [id]: { ...emptyAnswer(), ...state.answers[id], ...patch } } };
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
