# Work Skill Radar — 职场 AI 工具雷达

> 一站式发现、比较职场 AI 生产力工具的平台。自动爬取 GitHub 及 Awesome Lists，通过 AI 分类和中文摘要，按岗位/功能维度呈现工具排行与详情。

---

## 技术栈

| 层       | 选型                          |
|---------|-------------------------------|
| 框架     | Next.js 14 (App Router)       |
| 语言     | TypeScript                    |
| 数据库   | PostgreSQL + Prisma ORM       |
| 样式     | Tailwind CSS（暗色主题）      |
| AI 分类  | OpenAI API（gpt-4o-mini）     |
| 爬虫     | GitHub REST API + Awesome Lists |
| 部署     | Docker Compose + Nginx        |

---

## 快速开始（Docker Compose）

### 1. 克隆项目

```bash
git clone <your-repo-url> work-skill-radar
cd work-skill-radar
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填写以下必要项：

```env
DATABASE_URL="postgresql://wsr:changeme@db:5432/work_skill_radar"
GITHUB_TOKEN="ghp_..."          # GitHub 个人访问令牌（只读）
OPENAI_API_KEY="sk-..."         # OpenAI API 密钥
ADMIN_PASSWORD="your-password"  # 管理后台密码
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

### 3. 启动服务

```bash
# 构建并启动（首次较慢，约 2-5 分钟）
docker compose up -d --build

# 检查服务状态
docker compose ps
docker compose logs -f app
```

### 4. 初始化数据库

```bash
# 运行数据库迁移 + 种子数据（18 个预设工具）
docker compose run --rm migrate
```

或手动执行：

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx src/lib/seed.ts
```

### 5. 访问网站

- 网站主页：http://localhost:3000
- 管理后台：http://localhost:3000/admin

---

## 本地开发

### 前置条件

- Node.js 20+
- PostgreSQL 数据库

### 安装依赖

```bash
npm install
```

### 配置本地环境

```bash
cp .env.example .env.local
# 编辑 .env.local，填写 DATABASE_URL、GITHUB_TOKEN、OPENAI_API_KEY、ADMIN_PASSWORD
```

### 数据库初始化

```bash
# 推送 schema（开发环境）
npm run db:push

# 导入种子数据
npm run db:seed
```

### 启动开发服务器

```bash
npm run dev
# 访问 http://localhost:3000
```

---

## 生产部署（含 Nginx）

```bash
# 启动所有服务（含 Nginx 80 端口反代）
docker compose --profile prod up -d --build

# 运行迁移
docker compose --profile migrate run --rm migrate
```

### HTTPS / SSL

推荐使用 Certbot + Let's Encrypt，在宿主机配置反向代理至 Nginx 容器。

---

## 管理后台使用

访问 `/admin`，输入 `ADMIN_PASSWORD` 环境变量值登录。

### Dashboard

- 总工具数、已激活、待富化（无 AI 摘要）、已隐藏统计
- **一键爬取**：GitHub / Awesome Lists / 全部（后台异步运行）
- **AI 富化**：批量对待处理工具调用 OpenAI 生成中文摘要、分类、评分

### Skills 管理

- 按状态筛选：全部 / 待富化 / 已激活 / 已隐藏 / 不相关
- 切换激活 / 显示状态（单击图标即生效）
- 编辑名称、摘要、评分
- 对单个工具触发重新富化

### Logs 查看

- 爬取日志：来源、查询词、状态、新增/更新数量
- 富化日志：工具名、模型、状态、Token 用量、错误信息

---

## API 参考

| Method | Path | 说明 |
|--------|------|------|
| GET | `/api/skills` | 分页工具列表，支持 role/category/pricing 等过滤 |
| GET | `/api/skills/[id]` | 工具详情 + 相似工具 |
| GET | `/api/roles` | 14 个岗位及工具数 |
| GET | `/api/categories` | 20 个功能类别及工具数 |
| GET | `/api/rankings` | 排行榜（overall/free/opensource/newest 及岗位专属） |
| GET | `/api/search?q=` | 全局快速搜索 |
| GET | `/api/stats` | 公开统计数据 |
| POST | `/api/admin/crawl` | 触发爬取（需鉴权） |
| POST | `/api/admin/enrich` | 触发富化（需鉴权） |
| GET | `/api/admin/skills` | 管理端工具列表（需鉴权） |
| PATCH/DELETE | `/api/admin/skills/[id]` | 更新/删除工具（需鉴权） |
| GET | `/api/admin/logs` | 爬取/富化日志（需鉴权） |
| GET | `/api/admin/stats` | 管理端统计（需鉴权） |

**Admin 鉴权方式**（任选其一）：

```
Authorization: Bearer <ADMIN_PASSWORD>
x-admin-password: <ADMIN_PASSWORD>
?_pwd=<ADMIN_PASSWORD>
```

---

## 环境变量说明

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | ✅ | PostgreSQL 连接串 |
| `GITHUB_TOKEN` | ✅ | GitHub PAT（用于爬取，无需任何权限） |
| `OPENAI_API_KEY` | ✅ | OpenAI 密钥（用于 AI 富化） |
| `ADMIN_PASSWORD` | ✅ | 管理后台密码 |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 站点公开 URL（SEO 用） |
| `OPENAI_BASE_URL` | ⬜ | 可选，兼容 Azure / 本地代理 |
| `AI_MODEL` | ⬜ | 默认 `gpt-4o-mini`，可改为 `gpt-4o` 等 |
| `POSTGRES_PASSWORD` | ⬜ | Docker Compose 内部 DB 密码 |

---

## 项目结构

```
src/
├── app/
│   ├── page.tsx                 # 首页
│   ├── skills/
│   │   ├── page.tsx             # 工具列表（搜索+筛选）
│   │   └── [id]/page.tsx        # 工具详情
│   ├── roles/page.tsx           # 按岗位浏览
│   ├── categories/page.tsx      # 按功能浏览
│   ├── rankings/page.tsx        # 排行榜
│   └── admin/page.tsx           # 管理后台
│   └── api/
│       ├── skills/              # 公开 API
│       ├── roles/
│       ├── categories/
│       ├── rankings/
│       ├── search/
│       ├── stats/
│       └── admin/               # 管理 API（鉴权）
├── components/
│   ├── layout/                  # Header, Footer
│   ├── skills/                  # SkillCard, SkillFilters
│   └── ui/                      # button, badge, card, input
├── lib/
│   ├── crawler/                 # GitHub + Awesome Lists 爬虫
│   ├── enrichment/              # OpenAI 富化
│   ├── constants.ts             # 岗位/类别定义
│   ├── db.ts                    # Prisma client
│   ├── utils.ts                 # 工具函数
│   ├── auth.ts                  # 管理鉴权
│   └── seed.ts                  # 种子数据
└── types/index.ts               # TypeScript 类型

prisma/schema.prisma             # 数据库模型
Dockerfile
docker-compose.yml
nginx.conf
.env.example
```

---

## 验收清单

- [x] 首页展示统计数、热门工具、岗位快捷入口
- [x] 工具列表页：搜索、多维筛选、分页、排序
- [x] 工具详情页：中文摘要、工作流步骤、优缺点、相似工具
- [x] 按岗位浏览（14 个岗位）
- [x] 按功能浏览（20 个类别）
- [x] 排行榜（综合/免费/开源/最新 + 6 岗位专属）
- [x] GitHub 爬虫（搜索 + README 摘取）
- [x] Awesome Lists 爬虫（Markdown 解析）
- [x] OpenAI AI 富化（分类/摘要/评分/岗位）
- [x] 管理后台（Dashboard / 工具管理 / 爬取控制 / 日志）
- [x] Docker Compose 一键部署
- [x] 18 个预置种子工具
- [x] 全站暗色主题

---

## License

MIT
