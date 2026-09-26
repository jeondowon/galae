export function Icon({ name, size = 22 }) {
  const paths = {
    today: 'M3 10 12 3l9 7M5 9v11h5v-6h4v6h5V9',
    archive: 'M4 4h16v4H4zM6 8v12h12V8M10 12h4',
    groups: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M17 4a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    records: 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5',
    back: 'm14 5-7 7 7 7', arrow: 'M4 12h16m-6-6 6 6-6 6',
    plus: 'M12 5v14M5 12h14', check: 'm5 12 4 4L19 6',
    search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    leaf: 'M5 20c0-8 6-12 13-15M4 14C2 4 13 2 21 3c1 9-3 17-12 15M9 13l-5 7',
    lock: 'M6 10h12v11H6zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.arrow} /></svg>;
}

export function Header({ title, subtitle, back, action }) {
  return <header className="page-header"><div>{back && <button className="back-button" onClick={back}><Icon name="back" size={16} /> 돌아가기</button>}<h1 tabIndex={-1}>{title}</h1>{subtitle && <p className="sub">{subtitle}</p>}</div>{action}</header>;
}

export function Empty({ title, body, label, onClick }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="leaf" size={28} /></span><h3>{title}</h3><p className="sub">{body}</p>{label && <button className="btn-outline" onClick={onClick}>{label}<Icon name="arrow" size={16} /></button>}</div>;
}

export function Section({ title, label, onClick, children }) {
  return <section className="section"><div className="section-heading"><h2>{title}</h2>{label && (onClick ? <button className="text-link" onClick={onClick}>{label}<Icon name="arrow" size={14} /></button> : <span className="hint">{label}</span>)}</div>{children}</section>;
}

export function Avatar({ name, color = 'sage' }) {
  return <span className={`avatar ${color}`}>{name.slice(0, 1)}</span>;
}

export function BottomNav({ active, go }) {
  return <nav className="bottom-nav" aria-label="주 메뉴">{[['today', '오늘'], ['archive', '질문 모아보기'], ['groups', '그룹'], ['records', '나의 기록']].map(([id, label]) => <a key={id} href={`#/${id}`} aria-current={active === id ? 'page' : undefined} onClick={e => { e.preventDefault(); go(id); }}><span><Icon name={id} /></span>{label}</a>)}</nav>;
}
