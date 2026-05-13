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
    <footer style={{ marginTop: 64, position: 'relative', zIndex: 1, borderTop: '3px solid #000', background: '#000' }}>
      <div className="container" style={{ padding: '48px 0' }}>
        {/* Top CTA row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 pb-10" style={{ borderBottom: '3px solid #333' }}>
          <div className="max-w-2xl">
            <div
              className="sdv-chip inline-flex items-center font-dot"
              style={{ background: '#FFD600', color: '#000', border: '2px solid #FFD600', marginBottom: 16 }}
            >
              SAFE ZONE
            </div>
            <h2 className="font-pixel" style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#FFD600' }}>
              AI TOOLS, ZERO FLUFF
            </h2>
            <p className="font-dot mt-3" style={{ fontSize: '14px', color: '#aaa', lineHeight: 1.8, letterSpacing: '0.02em' }}>
              按岗位和功能整理 AI 工具，保持清晰分类和筛选逻辑。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/skills" className="sdv-btn" style={{ minHeight: 46 }}>
              打开工具栏 →
            </Link>
            <Link
              href="/rankings"
              className="sdv-btn"
              style={{ minHeight: 46, background: '#FFD600', color: '#000', border: '3px solid #FFD600', boxShadow: '4px 4px 0 #555' }}
            >
              查看排行
            </Link>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="sdv-slot flex items-center justify-center font-pixel" style={{ width: 36, height: 36, fontSize: '18px', background: '#FFD600', border: '3px solid #FFD600' }}>
                💀
              </span>
              <span className="font-pixel" style={{ fontSize: '22px', color: '#FFD600', letterSpacing: '0.04em' }}>
                AI SKILL RADAR
              </span>
            </Link>
            <p className="font-dot" style={{ fontSize: '13px', color: '#888', lineHeight: 1.8, maxWidth: 320, letterSpacing: '0.02em' }}>
              把工具发现、角色筛选和排行榜放进一套简单直接的面板里。
            </p>
          </div>

          {FOOTER_SECTIONS.map(section => (
            <div key={section.title}>
              <p className="font-pixel mb-3" style={{ fontSize: '18px', color: '#FFD600', letterSpacing: '0.04em' }}>
                {section.title.toUpperCase()}
              </p>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="font-dot" style={{ fontSize: '13px', color: '#888', letterSpacing: '0.02em', transition: 'color 100ms ease' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '2px solid #333' }}>
          <p className="font-dot" style={{ fontSize: '12px', color: '#666', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            © 2026 AI SKILL RADAR — NEO-BRUTALIST EDITION
          </p>
          <Link href="/admin" className="sdv-btn" style={{ minHeight: 38, fontSize: '12px', paddingInline: 14 }}>
            ADMIN
          </Link>
        </div>
      </div>
    </footer>
  )
}