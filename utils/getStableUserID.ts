export function getStableUserID() {
  const k = 'statsig_user_id';
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(k);
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(k, id);
  }
  return id;
}
