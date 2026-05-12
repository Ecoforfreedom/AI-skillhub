export async function register() {
  // Only run on the Node.js runtime (not Edge runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { autoSeed } = await import('./lib/seed')
      await autoSeed()
    } catch (e) {
      console.error('[instrumentation] auto-seed error:', e)
    }
  }
}
