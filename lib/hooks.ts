import { useEffect, useRef } from "react";

export function useDidUpdateEffect(effect: React.EffectCallback, deps?: React.DependencyList | undefined) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    isMountingRef.current = true;
  }, []);

  useEffect(() => {
    if (!isMountingRef.current) {
      return effect();
    } else {
      isMountingRef.current = false;
    }
  }, deps);
}