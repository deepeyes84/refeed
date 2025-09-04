(async () => {
  try {
    // 1) Unregister all service workers in this origin
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const r of regs) {
        try { await r.unregister(); } catch (e) { console.warn('Unregister failed', e); }
      }
    }
    // 2) Clear all named caches
    if (window.caches && caches.keys) {
      const keys = await caches.keys();
      for (const k of keys) {
        try { await caches.delete(k); } catch (e) { console.warn('Cache delete failed', e); }
      }
    }
    // 3) Storage cleanup (optional, best effort)
    try { localStorage.clear?.(); } catch {}
    try { sessionStorage.clear?.(); } catch {}
    // 4) Hard-reload without SW
    const u = new URL(location.href);
    u.searchParams.set('nocache', Date.now().toString());
    location.replace(u.toString());
  } catch (e) {
    console.error('SW reset error:', e);
  }
})();
