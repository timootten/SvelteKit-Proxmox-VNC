type TryCatchResult<T> =
  | [data: T, error: null]
  | [data: null, error: Error];

export async function tryCatch<T>(
  promise: Promise<T>
): Promise<TryCatchResult<T>> {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err instanceof Error ? err : new Error(String(err))];
  }
}
