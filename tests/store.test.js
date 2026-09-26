import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, updateAnswer, leaveGroup, loadState, STORAGE_KEY } from '../src/store.js';

test('질문별 초안과 제출 상태가 서로 섞이지 않는다', () => {
  const initial = initialState();
  let state = updateAnswer(initial, 'q037', { sel: 1, submitted: true, note: '오늘의 생각' });
  state = updateAnswer(state, 'q036', { sel: 0 });
  assert.equal(state.answers.q037.note, '오늘의 생각');
  assert.equal(state.answers.q037.sel, 1);
  assert.equal(state.answers.q036.sel, 0);
  assert.equal(state.answers.q036.submitted, false);
  assert.deepEqual(state.answers.q037.sharedWith, []);
  assert.deepEqual(initial.answers, {});
});

test('그룹을 나가면 그 그룹의 공유만 해제하고 선택과 성찰은 유지한다', () => {
  let state = { ...initialState(), joined: ['g1', 'g2'] };
  state = updateAnswer(state, 'q037', { sel: 0, submitted: true, completed: true, note: '나의 생각', sharedWith: ['g1', 'g2'] });
  state = updateAnswer(state, 'q036', { sel: 2, submitted: true, sharedWith: ['g1'] });
  const result = leaveGroup(state, 'g1');
  assert.deepEqual(result.joined, ['g2']);
  assert.deepEqual(result.answers.q037.sharedWith, ['g2']);
  assert.deepEqual(result.answers.q036.sharedWith, []);
  assert.equal(result.answers.q037.note, '나의 생각');
  assert.equal(result.answers.q037.completed, true);
  assert.equal(result.answers.q036.sel, 2);
  assert.deepEqual(state.answers.q037.sharedWith, ['g1', 'g2']);
});

test('공유 대상 초안은 저장 전까지 공개 대상에 반영되지 않으며 질문별로 복원된다', () => {
  let state = updateAnswer(initialState(), 'q037', { sel: 1, submitted: true, sharedWith: ['g1'] });
  state = updateAnswer(state, 'q037', { shareDraft: ['g2'] });
  state = updateAnswer(state, 'q036', { shareDraft: [] });
  assert.deepEqual(state.answers.q037.sharedWith, ['g1']);
  globalThis.localStorage = { getItem: () => JSON.stringify(state) };
  try {
    const restored = loadState();
    assert.deepEqual(restored.answers.q037.shareDraft, ['g2']);
    assert.deepEqual(restored.answers.q036.shareDraft, []);
    const saved = updateAnswer(restored, 'q037', { sharedWith: restored.answers.q037.shareDraft, shareDraft: null });
    assert.deepEqual(saved.answers.q037.sharedWith, ['g2']);
    assert.equal(saved.answers.q037.shareDraft, null);
  } finally { delete globalThis.localStorage; }
});

test('탈퇴한 그룹은 공유 대상 초안에서도 제거된다', () => {
  const state = updateAnswer(initialState(), 'q037', { sharedWith: ['g1'], shareDraft: ['g1', 'g2'] });
  const result = leaveGroup(state, 'g1');
  assert.deepEqual(result.answers.q037.sharedWith, []);
  assert.deepEqual(result.answers.q037.shareDraft, ['g2']);
  assert.deepEqual(state.answers.q037.shareDraft, ['g1', 'g2']);
});

test('어제 저장한 답변을 유지하면서 새 공유 초안 필드만 보완한다', () => {
  const saved = { ...initialState(), started: true, answers: { q037: { sel: 1, submitted: true, note: '어제 남긴 생각', sharedWith: ['g1'] } } };
  globalThis.localStorage = { getItem: () => JSON.stringify(saved) };
  try {
    const restored = loadState();
    assert.equal(restored.answers.q037.note, '어제 남긴 생각');
    assert.deepEqual(restored.answers.q037.sharedWith, ['g1']);
    assert.equal(restored.answers.q037.shareDraft, null);
    assert.deepEqual(restored.answers.q037.rx, []);
  } finally { delete globalThis.localStorage; }
});

test('저장된 답변과 그룹을 복원하고 손상된 저장 데이터는 초기화한다', () => {
  const saved = updateAnswer({ ...initialState(), started: true }, 'q036', { sel: 1, submitted: true, sharedWith: ['g1'] });
  globalThis.localStorage = { getItem: key => key === STORAGE_KEY ? JSON.stringify(saved) : null };
  assert.deepEqual(loadState(), saved);
  globalThis.localStorage = { getItem: () => '{broken' };
  assert.deepEqual(loadState(), initialState());
  globalThis.localStorage = { getItem: () => { throw new Error('storage blocked'); } };
  assert.deepEqual(loadState(), initialState());
  delete globalThis.localStorage;
});
