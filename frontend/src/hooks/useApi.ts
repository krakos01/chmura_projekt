import { useCallback, useEffect, useState } from 'react';

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface UseApiState<T> extends ApiState<T> {
  refresh: () => void;
}

/**
 * Lightweight data-fetching hook. Tracks loading, data, and error state, and
 * exposes a `refresh()` to re-run the fetcher. The provided `deps` array
 * controls when the fetch re-runs, much like `useEffect`.
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): UseApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: true,
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Reset to loading state before kicking off a new fetch. This is the
    // canonical data-fetching pattern; the linter flags any setState in an
    // effect, but this one is intentional and bounded by `cancelled`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetcher()
      .then((result) => {
        if (!cancelled) setState({ data: result, error: null, loading: false });
      })
      .catch((err: Error) => {
        if (!cancelled)
          setState((prev) => ({ ...prev, error: err, loading: false }));
      });

    return () => {
      cancelled = true;
    };
    // The fetcher is intentionally excluded — callers control re-fetching via
    // `deps` (consistent with the React `useEffect` mental model).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);
  return { ...state, refresh };
}
