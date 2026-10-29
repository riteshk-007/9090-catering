/** Admin light/dark theme, remembered in a cookie so the very first paint already uses it (no flash). */
export const ADMIN_THEME_COOKIE = 'admin_theme'
export type AdminTheme = 'dark' | 'light'

/** Runs in the browser before the page paints. Kept as a string so it can be inlined in the admin layout. */
export const ADMIN_THEME_SCRIPT = `
(function () {
  try {
    var m = document.cookie.match(/(?:^|; )${ADMIN_THEME_COOKIE}=(dark|light)/);
    var t = m ? m[1] : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var c = document.documentElement.classList;
    c.remove('admin-dark', 'admin-light', 'dark');
    c.add('admin-' + t);
    if (t === 'dark') c.add('dark');
  } catch (e) {}
})();
`

export function applyAdminTheme(theme: AdminTheme) {
  const c = document.documentElement.classList
  c.remove('admin-dark', 'admin-light', 'dark')
  c.add(`admin-${theme}`)
  if (theme === 'dark') c.add('dark')
  document.cookie = `${ADMIN_THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=strict`
}

export function currentAdminTheme(): AdminTheme {
  return document.documentElement.classList.contains('admin-light') ? 'light' : 'dark'
}
