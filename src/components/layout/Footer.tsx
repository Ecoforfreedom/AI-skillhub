import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ borderTop: '2px solid var(--px-border)', background: 'var(--px-bg)', marginTop: 64, position: 'relative', zIndex: 1 }}>
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 font-pixel mb-4" style={{ fontSize: '11px', color: 'var(--px-green)', textShadow: '0 0 8px var(--px-green)' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28,
                border: '2px solid var(--px-green)',
                fontSize: '14px',
              }}>⚡</span>
              SKILL<span style={{ color: 'var(--px-cyan)' }}>RADAR</span>
            </Link>
            <p className="font-vt" style={{ fontSize: '17px', color: '#4a5568', lineHeight: '1.6' }}>
              发现每个岗位能用的 AI 工具和自动化技能，让职场效率翻倍。
            </p>
          </div>
          <div>
            <p className="font-pixel mb-3" style={{ fontSize: '8px', color: '#8892a4' }}>&gt; 导航</p>
            <ul className="space-y-2">
              {[
                { href: '/skills', label: '全部工具' },
                { href: '/roles', label: '按岗位' },
                { href: '/categories', label: '按功能' },
                { href: '/rankings', label: '榜单' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-vt transition-colors" style={{ fontSize: '18px', color: '#4a5568' }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--px-green)')}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = '#4a5568')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-pixel mb-3" style={{ fontSize: '8px', color: '#8892a4' }}>&gt; 热门岗位</p>
            <ul className="space-y-2">
              {[
                { href: '/skills?role=consulting', label: '咨询顾问' },
                { href: '/skills?role=finance', label: '金融投资' },
                { href: '/skills?role=engineering', label: '技术开发' },
                { href: '/skills?role=product', label: '产品经理' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-vt transition-colors" style={{ fontSize: '18px', color: '#4a5568' }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--px-cyan)')}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = '#4a5568')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-pixel mb-3" style={{ fontSize: '8px', color: '#8892a4' }}>&gt; 热门功能</p>
            <ul className="space-y-2">
              {[
                { href: '/skills?category=automation', label: '自动化' },
                { href: '/skills?category=meeting', label: '会议纪要' },
                { href: '/skills?category=coding', label: '编程开发' },
                { href: '/skills?category=presentation', label: 'PPT制作' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="font-vt transition-colors" style={{ fontSize: '18px', color: '#4a5568' }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = 'var(--px-purple)')}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = '#4a5568')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: '2px solid var(--px-border)' }}>
          <p className="font-pixel" style={{ fontSize: '7px', color: '#2a2a4a' }}>© 2026 SKILL RADAR — LEVEL UP YOUR WORKFLOW</p>
          <Link href="/admin" className="font-pixel transition-colors" style={{ fontSize: '7px', color: '#2a2a4a' }}
            onMouseOver={e => ((e.currentTarget as HTMLElement).style.color = '#4a5568')}
            onMouseOut={e => ((e.currentTarget as HTMLElement).style.color = '#2a2a4a')}
          >[ADMIN]</Link>
        </div>
      </div>
    </footer>
  )
}

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-16">
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-white mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm">Work Skill Radar</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              发现每个岗位能用的 AI 工具和自动化技能，让职场效率翻倍。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">导航</p>
            <ul className="space-y-2">
              {[
                { href: '/skills', label: '全部工具' },
                { href: '/roles', label: '按岗位' },
                { href: '/categories', label: '按功能' },
                { href: '/rankings', label: '榜单' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">热门岗位</p>
            <ul className="space-y-2">
              {[
                { href: '/skills?role=consulting', label: '咨询顾问' },
                { href: '/skills?role=finance', label: '金融投资' },
                { href: '/skills?role=engineering', label: '技术开发' },
                { href: '/skills?role=product', label: '产品经理' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">热门功能</p>
            <ul className="space-y-2">
              {[
                { href: '/skills?category=automation', label: '自动化' },
                { href: '/skills?category=meeting', label: '会议纪要' },
                { href: '/skills?category=coding', label: '编程开发' },
                { href: '/skills?category=presentation', label: 'PPT制作' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">© 2026 Work Skill Radar. 帮助职场人发现最有价值的效率工具。</p>
          <Link href="/admin" className="text-xs text-gray-700 hover:text-gray-500 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
