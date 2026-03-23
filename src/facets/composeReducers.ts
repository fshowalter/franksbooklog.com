// AIDEV-NOTE: composeReducers threads an action through a sequence of facet reducers
// left-to-right. Each facet handles its own action types and returns state unchanged
// for everything else. Order matters only for filters/removeAppliedFilter: array-keyed
// facets (kind, reviewedStatus) must precede filtersLifecycleReducer so their
// prefix-based removal runs before the scalar key-equals-id fallback.
export function composeReducers<TState>(
  ...reducers: ((state: TState, action: { type: string }) => TState)[]
): (state: TState, action: { type: string }) => TState {
  return (state, action) => {
    let result = state;
    for (const reducer of reducers) {
      result = reducer(result, action);
    }
    return result;
  };
}
