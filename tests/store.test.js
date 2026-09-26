import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, updateAnswer, saveReflection, questionRoute, rememberQuestionRoute, leaveGroup, loadState, STORAGE_KEY } from '../src/store.js';

function restore(saved) {
  globalThis.localStorage = { getItem: () => JSON.stringify(saved) };
  try { return loadState(); } finally { delete globalThis.localStorage; }
}

test('선택 이유 초안은 질문별로 복원되고 제출 이후에도 성찰과 구분된다', () => {
  let state = updateAnswer(initialState(), 'q037', { sel: 1, reason: '친구의 이야기를 먼저 듣고 싶어요.\n회복할 기회도 필요해요.' });
  state = updateAnswer(state, 'q036', { reason: '다른 질문에 대한 생각' });
  state = restore(state);
  assert.equal(state.answers.q037.reason, '친구의 이야기를 먼저 듣고 싶어요.\n회복할 기회도 필요해요.');
  assert.equal(state.answers.q036.reason, '다른 질문에 대한 생각');
  assert.equal(state.answers.q037.submitted, false);
  state = updateAnswer(state, 'q037', { submitted: true, shift: 1, note: '다른 의견을 읽은 뒤의 성찰' });
  state = restore(saveReflection(state, 'q037'));
  assert.equal(state.answers.q037.reason, '친구의 이야기를 먼저 듣고 싶어요.\n회복할 기회도 필요해요.');
  assert.equal(state.answers.q037.savedNote, '다른 의견을 읽은 뒤의 성찰');
  assert.deepEqual(state.answers.q037.sharedWith, []);
});

test('이유를 작성하지 않은 답변도 제출 상태를 유지한다', () => {
  const state = restore(updateAnswer(initialState(), 'q037', { sel: 0, submitted: true }));
  assert.equal(state.answers.q037.reason, '');
  assert.equal(state.answers.q037.submitted, true);
});

test('기존 답변과 잘못된 이유 필드는 빈 이유로 복구하고 성찰을 보존한다', () => {
  for (const reason of [undefined, null, 42, {}, []]) {
    const state = restore({ ...initialState(), answers: { q037: { sel: 0, submitted: true, reason, note: '기존 성찰' } } });
    assert.equal(state.answers.q037.reason, '');
    assert.equal(state.answers.q037.note, '기존 성찰');
    assert.equal(state.answers.q037.submitted, true);
  }
});

test('성찰 초안은 복원되지만 저장 전까지 공유할 성찰을 변경하지 않는다', () => {
  let state = updateAnswer(initialState(), 'q037', { sel: 0, submitted: true, shift: 1, note: '저장한 문장' });
  state = saveReflection(state, 'q037');
  state = updateAnswer(state, 'q037', { sharedWith: ['g1', 'g2'], note: '작성 중인 문장' });
  state = restore(state);
  assert.equal(state.answers.q037.note, '작성 중인 문장');
  assert.equal(state.answers.q037.savedNote, '저장한 문장');
  state = saveReflection(state, 'q037');
  assert.equal(state.answers.q037.savedNote, '작성 중인 문장');
  assert.deepEqual(state.answers.q037.sharedWith, ['g1', 'g2']);
  state = updateAnswer(state, 'q037', { note: '' });
  assert.equal(state.answers.q037.savedNote, '작성 중인 문장');
  assert.equal(saveReflection(state, 'q037').answers.q037.savedNote, '');
});

test('처음 작성하는 초안도 성찰 저장 전에는 공유 내용에 포함되지 않는다', () => {
  let state = updateAnswer(initialState(), 'q037', { sel: 0, submitted: true, note: '비공개 초안', sharedWith: ['g1'] });
  assert.equal(restore(state).answers.q037.savedNote, '');
  assert.equal(saveReflection(state, 'q037'), state);
  state = updateAnswer(state, 'q037', { shift: 0 });
  assert.equal(saveReflection(state, 'q037').answers.q037.savedNote, '비공개 초안');
});

test('이전 버전의 공개된 성찰은 보존하고 비공개 초안은 공개하지 않는다', () => {
  const state = restore({ ...initialState(), answers: {
    q037: { sel: 0, submitted: true, note: '기존 공유 문장', sharedWith: ['g1'] },
    q036: { sel: 0, submitted: true, note: '기존 초안' },
    q035: { sel: 0, submitted: true, completed: true, shift: 0, note: '완료한 성찰' },
  } });
  assert.equal(state.answers.q037.savedNote, '기존 공유 문장');
  assert.equal(state.answers.q036.savedNote, '');
  assert.equal(state.answers.q036.note, '기존 초안');
  assert.equal(state.answers.q035.savedNote, '완료한 성찰');
});

test('탭 이동과 새로고침 후 질문별 마지막 단계를 이어 보고 완료한 질문은 기록으로 간다', () => {
  let state = { ...initialState(), started: true };
  assert.equal(questionRoute('q037', state.answers.q037), 'question/q037/answer');
  state = updateAnswer(state, 'q037', { sel: 0, submitted: true });
  state = rememberQuestionRoute(state, 'question/q037/reading');
  state = updateAnswer(state, 'q036', { sel: 1, submitted: true });
  state = rememberQuestionRoute(state, 'question/q036/reflect');
  state = rememberQuestionRoute(state, 'today');
  state = restore(state);
  assert.equal(questionRoute('q037', state.answers.q037), 'question/q037/reading');
  assert.equal(questionRoute('q036', state.answers.q036), 'question/q036/reflect');
  state = rememberQuestionRoute(state, 'question/q037/opinions');
  assert.equal(questionRoute('q037', state.answers.q037), 'question/q037/opinions');
  state = updateAnswer(state, 'q037', { shift: 0 });
  state = saveReflection(state, 'q037');
  assert.equal(questionRoute('q037', state.answers.q037), 'records/q037');
});

test('잘못된 경로와 온보딩은 진행 단계를 기록하지 않고 직접 접근의 잠금도 유지한다', () => {
  const initial = initialState();
  assert.equal(rememberQuestionRoute(initial, 'question/q037/reading'), initial);
  let state = { ...initial, started: true };
  for (const route of ['question/unknown/reading', 'question/q037/wrong', 'question/q037/reading/extra']) {
    assert.equal(rememberQuestionRoute(state, route), state);
  }
  state = rememberQuestionRoute(state, 'question/q037/reading');
  assert.equal(state.answers.q037.lastStep, 'answer');
  state = updateAnswer(state, 'q037', { sel: 0, submitted: true });
  state = rememberQuestionRoute(state, 'question/q037/done');
  assert.equal(state.answers.q037.lastStep, 'reflect');
  assert.equal(questionRoute('q036', { submitted: true }), 'question/q036/result');
});

test('필드가 손상된 답변은 정상 문장을 보존하고 잘못된 필드만 복구한다', () => {
  const state = restore({ ...initialState(), started: 'yes', answers: {
    q037: { sel: 0, submitted: true, note: '보존할 문장', sharedWith: null, rx: {}, shift: 99, completed: true, shareDraft: 'g1', lastStep: 'invalid', savedNote: null },
    q036: { sel: 99, submitted: true, note: null, sharedWith: [null, 'g1', 1], rx: ['이해됐어요', null] },
    q035: null,
  } });
  assert.equal(state.started, false);
  assert.equal(state.answers.q037.note, '보존할 문장');
  assert.deepEqual(state.answers.q037.sharedWith, []);
  assert.deepEqual(state.answers.q037.rx, []);
  assert.equal(state.answers.q037.shift, null);
  assert.equal(state.answers.q037.completed, false);
  assert.equal(state.answers.q037.shareDraft, null);
  assert.equal(state.answers.q037.lastStep, null);
  assert.equal(state.answers.q037.savedNote, '');
  assert.equal(state.answers.q036.sel, null);
  assert.equal(state.answers.q036.submitted, false);
  assert.equal(state.answers.q036.note, '');
  assert.deepEqual(state.answers.q036.sharedWith, []);
  assert.deepEqual(state.answers.q036.rx, ['이해됐어요']);
  assert.equal(state.answers.q035.note, '');
  assert.doesNotThrow(() => leaveGroup(state, 'g1'));
});

test('그룹과 멤버의 손상은 다른 정상 답변을 잃지 않고 복구한다', () => {
  const saved = { ...initialState(), answers: { q037: { note: '보존할 문장' } }, groups: [
    null, { id: 'custom', name: null, description: 5, code: null, members: [null, { id: 'm', name: 3 }] },
    { ...initialState().groups[0], members: null },
  ], joined: [null, 'g1', 'custom', 'missing'] };
  const state = restore(saved);
  assert.equal(state.answers.q037.note, '보존할 문장');
  assert.deepEqual(state.joined, ['g1', 'custom']);
  assert.equal(typeof state.groups[0].name, 'string');
  assert.equal(typeof state.groups[0].members[0].name, 'string');
  assert.ok(Array.isArray(state.groups[1].members));
  assert.equal(restore({ ...saved, groups: null }).answers.q037.note, '보존할 문장');
});

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
