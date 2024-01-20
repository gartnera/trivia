import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

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

/**
 * useResumed allows you to be notified when the application is resumed from the backgrounded state
 */
export function useResumed() {
  const [resumedCtr, setResumedCtr] = useState(0);

  useEffect(() => {
    let currentAppState = AppState.currentState;
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        currentAppState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setResumedCtr((prev) => prev + 1)
      }
      currentAppState = AppState.currentState;
    });

    return () => {
      subscription.remove();
    };
  }, [setResumedCtr]);

  return resumedCtr
}