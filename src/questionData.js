import { QUESTION, CHOICES, OPINIONS, READING } from './data.js';

// 고정된 데모 콘텐츠입니다. 날짜와 참여 수는 실제 서비스 데이터가 아닙니다.
export const QUESTIONS = [
  { id: 'q037', date: '2026-09-25', category: '정직', title: '친구의 잘못을 알게 된다면', ...QUESTION, choices: CHOICES, opinions: OPINIONS, reading: READING },
  {
    id: 'q036', no: '036', date: '2026-09-24', category: '관계', title: '먼저 사과하는 용기',
    body: '친구와 다툰 뒤 연락이 끊겼습니다. 서로에게 잘못이 있다고 느끼지만, 친구는 먼저 연락하지 않습니다. 당신이라면 어떻게 하시겠습니까?',
    participants: 986,
    choices: [{ id: 0, text: '먼저 연락해 내 잘못을 사과한다', short: '먼저 사과한다', pct: 52 }, { id: 1, text: '감정이 가라앉을 때까지 시간을 둔다', short: '시간을 둔다', pct: 36 }, { id: 2, text: '친구가 먼저 연락하기를 기다린다', short: '연락을 기다린다', pct: 12 }],
    opinions: [{ label: '먼저 사과한다', items: ['내 몫의 잘못부터 인정하면 대화를 시작할 수 있을 것 같아요.'] }, { label: '시간을 둔다', items: ['화가 난 채로 이야기하면 다시 상처를 줄까 봐 걱정돼요.'] }, { label: '연락을 기다린다', items: ['늘 내가 먼저 다가가는 관계인지도 돌아보고 싶어요.'] }],
    reading: { values: ['관계', '용기', '회복'], body: '화해를 향한 첫걸음은 상대의 잘못을 모두 받아들이는 일과 같지 않습니다. 자신의 몫을 인정하면서도 서로의 마음을 충분히 들을 수 있습니다. 관계를 회복할 준비가 되었는지 돌아보세요.', verse: '내가 먼저 건넬 수 있는 말은 무엇일까요?', ref: '함께 묵상하기 · 마태복음 5:23–24' },
  },
  {
    id: 'q035', no: '035', date: '2026-09-23', category: '책임', title: '함께한 일, 다른 무게',
    body: '팀 과제에 거의 참여하지 않은 팀원이 같은 점수를 받게 되었습니다. 개인적인 사정이 있었다고 합니다. 당신이라면 어떻게 하시겠습니까?', participants: 1102,
    choices: [{ id: 0, text: '실제 기여도를 교수님께 알린다', short: '기여도를 알린다', pct: 31 }, { id: 1, text: '사정을 듣고 남은 역할을 함께 정한다', short: '남은 역할을 정한다', pct: 58 }, { id: 2, text: '이번에는 같은 점수를 받도록 한다', short: '같은 점수를 받는다', pct: 11 }],
    opinions: [{ label: '기여도를 알린다', items: ['함께 애쓴 팀원들의 시간도 존중받아야 해요.'] }, { label: '남은 역할을 정한다', items: ['아직 할 수 있는 일이 있다면 기회를 주고 싶어요.'] }, { label: '같은 점수를 받는다', items: ['어려울 때 서로의 짐을 져줄 수도 있다고 생각해요.'] }],
    reading: { values: ['책임', '공정', '공동체'], body: '서로의 짐을 나누는 마음과 자기 몫을 감당하는 책임은 함께 생각할 수 있습니다. 사정을 듣는 일에서 시작해 공동체가 받아들일 수 있는 약속을 찾아보세요.', verse: '배려와 책임을 함께 지키는 방법은 무엇일까요?', ref: '함께 묵상하기 · 갈라디아서 6:2–5' },
  },
  {
    id: 'q034', no: '034', date: '2026-09-22', category: '나눔', title: '내게 더 주어진 것',
    body: '아르바이트 급여가 약속보다 더 들어왔습니다. 사장님은 아직 모르시는 것 같습니다. 당신이라면 어떻게 하시겠습니까?', participants: 873,
    choices: [{ id: 0, text: '바로 연락해서 초과 금액을 돌려드린다', short: '바로 돌려드린다', pct: 61 }, { id: 1, text: '추가 수당인지 먼저 확인한다', short: '먼저 확인한다', pct: 34 }, { id: 2, text: '다음 급여까지 기다려본다', short: '기다려본다', pct: 5 }],
    opinions: [{ label: '바로 돌려드린다', items: ['내 몫이 아니라는 걸 알면 마음이 불편할 것 같아요.'] }, { label: '먼저 확인한다', items: ['추측하기 전에 정확한 상황을 알고 싶어요.'] }, { label: '기다려본다', items: ['정산 과정에서 조정될 수도 있지 않을까요.'] }],
    reading: { values: ['정직', '신뢰', '책임'], body: '작은 일에서의 신뢰도 관계를 만들어갑니다. 내게 유리한 상황을 마주했을 때 사실을 확인하고 상대에게 알리는 과정에는 어떤 마음이 필요한지 생각해보세요.', verse: '내 몫을 정하는 기준은 무엇인가요?', ref: '함께 묵상하기 · 누가복음 16:10' },
  },
  {
    id: 'q033', no: '033', date: '2026-09-21', category: '관계', title: '도움이 필요하다는 말',
    body: '혼자 감당하기 어려운 일이 생겼습니다. 가까운 사람들도 바빠 보여 도움을 청하기 망설여집니다. 당신이라면 어떻게 하시겠습니까?', participants: 764,
    choices: [{ id: 0, text: '믿을 수 있는 사람에게 솔직하게 말한다', short: '솔직하게 말한다', pct: 49 }, { id: 1, text: '작은 도움부터 구체적으로 부탁한다', short: '작은 도움을 부탁한다', pct: 42 }, { id: 2, text: '조금 더 혼자 해결해본다', short: '혼자 해결해본다', pct: 9 }],
    opinions: [{ label: '솔직하게 말한다', items: ['말하지 않으면 서로의 어려움을 알기 힘들어요.'] }, { label: '작은 도움을 부탁한다', items: ['구체적으로 부탁하면 상대도 부담이 덜할 것 같아요.'] }, { label: '혼자 해결해본다', items: ['스스로 해볼 시간이 조금 더 필요해요.'] }],
    reading: { values: ['공동체', '신뢰', '용기'], body: '도움을 주는 것뿐 아니라 받는 것도 함께 살아가는 방식입니다. 지금 나에게 필요한 도움은 무엇인지, 누구와 그 마음을 나눌 수 있는지 생각해보세요.', verse: '오늘 누구에게 손을 내밀 수 있을까요?', ref: '함께 묵상하기 · 전도서 4:9–10' },
  },
  {
    id: 'q032', no: '032', date: '2026-09-20', category: '책임', title: '지키기 어려워진 약속',
    body: '친구와 오래전 정한 약속에 갈 수 없는 사정이 생겼습니다. 친구는 이 만남을 많이 기다렸습니다. 당신이라면 어떻게 하시겠습니까?', participants: 921,
    choices: [{ id: 0, text: '사정을 바로 설명하고 다른 날을 제안한다', short: '설명하고 조정한다', pct: 72 }, { id: 1, text: '어떻게든 원래 약속을 지킨다', short: '원래 약속을 지킨다', pct: 20 }, { id: 2, text: '상황이 나아질 때까지 조금 더 기다린다', short: '조금 더 기다린다', pct: 8 }],
    opinions: [{ label: '설명하고 조정한다', items: ['상대가 준비할 수 있도록 미리 알리고 싶어요.'] }, { label: '원래 약속을 지킨다', items: ['기다린 마음을 생각하면 쉽게 바꾸기 어려워요.'] }, { label: '조금 더 기다린다', items: ['아직 상황이 확실하지 않아서 고민돼요.'] }],
    reading: { values: ['책임', '배려', '정직'], body: '약속을 소중히 여기는 마음은 지킬 수 없게 되었을 때도 드러납니다. 상황을 솔직하게 전하고 상대의 시간을 배려할 수 있는 방법을 찾아보세요.', verse: '지금 할 수 있는 책임 있는 행동은 무엇인가요?', ref: '함께 묵상하기 · 마태복음 5:37' },
  },
];

export const TODAY = QUESTIONS[0];
export const MEMBERS = [{ id: 'm1', name: '서연', color: 'peach' }, { id: 'm2', name: '민준', color: 'blue' }, { id: 'm3', name: '하은', color: 'sage' }, { id: 'm4', name: '지우', color: 'lilac' }];
export const DEMO_GROUPS = [
  { id: 'g1', name: '한 걸음 청년부', description: '서로의 생각을 듣고, 함께 한 걸음씩 자라가요.', code: 'GARA01', color: 'sage', owner: false, members: MEMBERS.slice(0, 3) },
  { id: 'g2', name: '목요일의 작은 모임', description: '목요일마다 나누는 우리의 질문과 이야기.', code: 'GARA26', color: 'peach', owner: false, members: MEMBERS.slice(2) },
];
export const SAMPLE_SHARES = [
  { groupId: 'g1', questionId: 'q037', memberId: 'm1', sel: 1, note: '잘못을 말해주는 것도 친구를 아끼는 방법일 수 있겠다는 생각이 들었어요.' },
  { groupId: 'g1', questionId: 'q037', memberId: 'm2', sel: 0, note: '같이 시험을 준비한 사람들의 마음도 생각하게 돼요.' },
  { groupId: 'g1', questionId: 'q036', memberId: 'm3', sel: 0, note: '누가 먼저인지보다 다시 이야기할 수 있다는 게 더 소중해요.' },
  { groupId: 'g2', questionId: 'q037', memberId: 'm3', sel: 1, note: '먼저 친구의 이야기를 들어보고 싶어요.' },
];
export const dateLabel = date => `${Number(date.slice(5, 7))}월 ${Number(date.slice(8, 10))}일`;
