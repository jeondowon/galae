import { useEffect, useState } from 'react';

// 화면 진입 직후 막대가 0에서 차오르도록 한 틱 늦게 true가 된다
export default function useGrow() {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGrown(true), 60);
    return () => clearTimeout(t);
  }, []);
  return grown;
}
