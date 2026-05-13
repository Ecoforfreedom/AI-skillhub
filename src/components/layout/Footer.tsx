import Link from 'next/link'

const FOOTER_SECTIONS = [
  {
    title: '导航',
    links: [
      { href: '/skills', label: '全部工具' },
      { href: '/roles', label: '按岗位' },
      { href: '/categories', label: '按功能' },
      { href: '/rankings', label: '排行榜' },
    ],
  },
  {
    title: '热门岗位',
    links: [
      { href: '/skills?role=consulting', label: '咨询顾问' },
      { href: '/skills?role=finance', label: '金融投资' },
      { href: '/skills?role=engineering', label: '技术开发' },
      { href: '/skills?role=product', label: '产品经理' },
    ],
  },
  {
    title: '热门功能',
    links: [
      { href: '/skills?category=automation', label: '自动化' },
      { href: '/skills?category=meeting', label: '会议纪要' },
      { href: '/skills?category=coding', label: '编程开发' },
      { href: '/skills?category=presentation', label: 'PPT制作' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ marginTop: 88, position: 'relative', zIndex: 1 }}>
      <div className="container">
        <div className="sdv-panel p-8 md:p-10" style={{ overflow: 'hidden' }}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 pb-8" style={{ borderBottom: '1px solid rgba(151, 184, 255, 0.1)' }}>
          <div className="max-w-2xl">
            <div className="sdv-chip inline-flex items-center font-dot" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sdv-silver)' }}>
              AI Tooling Intelligence
            </div>
            <h2 className="font-pixel mt-5" style={{ fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--sdv-cream)' }}>
              用更产品化的方式管理团队的 AI 工具栈
            </h2>
            <p className="font-dot mt-3" style={{ fontSize: '16px', color: 'var(--sdv-dim)', lineHeight: 1.8 }}>
              从发现、筛选到建立共识，把不断出现的新工具整理成能服务业务团队的决策界面。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/skills" className="sdv-btn" style={{ minHeight: 46 }}>
              浏览工具目录
            </Link>
            <Link href="/rankings" className="sdv-btn" style={{ minHeight: 46, background: 'rgba(9, 18, 34, 0.28)', color: 'var(--sdv-silver)' }}>
              查看高分榜单
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="sdv-slot flex items-center justify-center" style={{ width: 38, height: 38 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, var(--sdv-teal), var(--sdv-blue))',
                    boxShadow: '0 0 18px rgba(124, 230, 255, 0.4)',
                  }}
                />
              </span>
              <span className="font-pixel" style={{ fontSize: '20px', color: 'var(--sdv-cream)' }}>
                AI Skill Radar
              </span>
            </Link>
            <p className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)', lineHeight: 1.8, maxWidth: 320 }}>
              为团队提供结构化的 AI 工具发现、岗位导航和知识网络，让新工具从噪音变成可执行的工作流资产。
            </p>
          </div>

          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="font-pixel mb-3" style={{ fontSize: '14px', color: 'var(--sdv-silver)' }}>
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-dot" style={{ fontSize: '15px', color: 'var(--sdv-dim)', transition: 'color 220ms ease' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(151, 184, 255, 0.1)' }}>
          <p className="font-dot" style={{ fontSize: '14px', color: 'var(--sdv-dim)' }}>
            © 2026 AI Skill Radar. Designed for high-signal AI tooling discovery.
          </p>
          <Link href="/admin" className="sdv-btn" style={{ minHeight: 42, fontSize: '14px' }}>
            Admin Console
          </Link>
        </div>
        </div>
      </div>
    </footer>
  )
}