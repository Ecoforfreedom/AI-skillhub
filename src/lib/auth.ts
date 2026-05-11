import { NextRequest, NextResponse } from 'next/server'

export function checkAdminAuth(req: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return false

  // Check Authorization header: Bearer <password>
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7) === password
  }

  // Check x-admin-password header
  const headerPwd = req.headers.get('x-admin-password')
  if (headerPwd) return headerPwd === password

  // Check query param (for GET requests in browser)
  const url = new URL(req.url)
  const queryPwd = url.searchParams.get('_pwd')
  if (queryPwd) return queryPwd === password

  return false
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
