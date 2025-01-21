export function cleanUndefined<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as T;
  }
  