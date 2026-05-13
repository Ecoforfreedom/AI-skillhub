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
    <footer
      style={{
        marginTop: 64,
        borderTop: '4px solid var(--sdv-border)',
        boxShadow: '0 -3px 0 var(--sdv-sh)',
        background: 'linear-gradient(0deg, var(--sdv-wood2) 0%, var(--sdv-wood) 100%)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="sdv-slot flex items-center justify-center text-lg" style={{ width: 34, height: 34 }}>
                🌾
              </span>
              <span className="font-pixel" style={{ fontSize: '9px', color: 'var(--sdv-gold)', textShadow: '1px 1px 0 var(--sdv-sh)' }}>
                SKILL <span style={{ color: 'var(--sdv-teal)' }}>RADAR</span>
              </span>
            </Link>
            <p className="font-dot" style={{ fontSize: '16px', color: 'var(--sdv-dim)', lineHeight: 1.7 }}>
              发现每个岗位能用的 AI 工具和自动化技能，让你的工作流像经营农场一样稳步升级。
            </p>
          </div>

          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="font-pixel mb-3" style={{ fontSize: '7px', color: 'var(--sdv-warm)' }}>
                ▸ {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-dot" style={{ fontSize: '17px', color: 'var(--sdv-dim)' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '3px solid var(--sdv-sh)' }}>
          <p className="font-pixel" style={{ fontSize: '6px', color: 'var(--sdv-dim)' }}>
            © 2026 SKILL RADAR ✦ LEVEL UP YOUR WORKFLOW
          </p>
          <Link href="/admin" className="font-pixel" style={{ fontSize: '6px', color: 'var(--sdv-warm)' }}>
            ⚙ ADMIN
          </Link>
        </div>
      </div>
    </footer>
  )
}