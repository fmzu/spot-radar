import { useEffect, useState } from 'react';

/**
 * 値の変化が止まってからdelayMs後に反映される値を返す。
 * 地図移動やスライダー操作のたびにAPIを叩かないための仕組み（debounce）。
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
