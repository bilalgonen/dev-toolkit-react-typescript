export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

/** Runs `fn`, converting thrown errors into a Result. */
export function attempt<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
