let cachedUserId: string | null = null;

export function getStableUserID() {
  const k = 'statsig_user_id';
  if (typeof window === 'undefined') return 'server';
  if (cachedUserId) return cachedUserId;
  let id = localStorage.getItem(k);
  if (!id) {
    try {
      const uuid = (globalThis.crypto as any)?.randomUUID?.();
      id = uuid ? `user_${uuid}` : 'user_' + Math.random().toString(36).slice(2, 10);
    } catch {
      id = 'user_' + Math.random().toString(36).slice(2, 10);
    }
    localStorage.setItem(k, id);
  }
  cachedUserId = id;
  return id;
}
