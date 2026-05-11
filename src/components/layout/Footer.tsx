import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
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
