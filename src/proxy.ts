import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth'

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protege a rota administrativa
  if (path.startsWith('/admin')) {
    // Permite livre acesso ao /admin/login
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get('admin_session')?.value;
    const session = await decrypt(sessionCookie);

    // Se estiver sem sessão, chuta de volta pro login
    if (!session) {
       return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
