/** The outcome of splitting `Promise.allSettled` results into successes and failure reasons. */
export interface SettledPartition<T> {
  fulfilled: T[];
  rejected: unknown[];
}

/**
 * Splits `Promise.allSettled` results into fulfilled values and rejection
 * reasons in a single pass.
 * @remarks Exists so a caller merging multiple independent sources (e.g. one
 *   per region) can render whatever succeeded instead of discarding
 *   everything the moment any one source fails, without hand-rolling the
 *   same fulfilled/rejected split at every call site.
 */
export function partitionSettled<T>(
  results: readonly PromiseSettledResult<T>[],
): SettledPartition<T> {
  const fulfilled: T[] = [];
  const rejected: unknown[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      fulfilled.push(result.value);
    } else {
      rejected.push(result.reason);
    }
  }
  return { fulfilled, rejected };
}
