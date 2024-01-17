import { useEffect, useRef, useState } from "react";

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

/**
 * useEffectWithTrigger allows you to force the effect to refire. This is useful for reload logic.
 */
export function useEffectWithTrigger(effect: React.EffectCallback, deps?: React.DependencyList | undefined) {
  const [triggerCtr, setTriggerCtr] = useState(0);
  deps = deps ? [...deps, triggerCtr] : [triggerCtr]
  useEffect(effect, deps)
  return () => setTriggerCtr((old) => old + 1)
}