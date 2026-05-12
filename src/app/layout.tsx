import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'AI Skill Radar ★ 发现每个岗位能用的 AI 工具',
  description:
    '收录各岗位能用的 AI 工具、自动化方案、Prompt 模板、MCP Server 和最佳实践，帮助职场人快速找到直接能用的提效工具。',
  keywords: ['AI工具', '自动化', '工作效率', 'AI workflow', 'MCP', '提效工具'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--sdv-night)', position: 'relative', zIndex: 1 }}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

