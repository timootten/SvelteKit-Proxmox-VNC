export async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err instanceof Error ? err : new Error(String(err))];
  }
}
