export function saveLS<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function loadLS<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}
