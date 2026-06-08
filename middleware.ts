import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── 1. Belum login → redirect ke login
  if (!user && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // ── 2. Sudah login, ambil role dari database
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    const role = profile?.role ?? 'anggota';
    const status = profile?.status ?? 'pending';

    // ── 3. Akun belum disetujui → redirect ke halaman tunggu
    if (status === 'pending' && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/menunggu', request.url));
    }

    // ── 4. Akun ditolak → redirect ke halaman ditolak
    if (status === 'ditolak' && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/ditolak', request.url));
    }

    // ── 5. Anggota/Humas tidak boleh akses /dashboard/admin
    if (path.startsWith('/dashboard/admin') && role === 'anggota') {
      return NextResponse.redirect(new URL('/dashboard/anggota', request.url));
    }

    // ── 6. Humas hanya boleh akses /dashboard/humas
    if (path.startsWith('/dashboard/admin') && role === 'humas') {
      return NextResponse.redirect(new URL('/dashboard/humas', request.url));
    }

    // ── 7. Sudah login, buka halaman auth → redirect sesuai role
    if (path.startsWith('/auth/login') || path.startsWith('/auth/register')) {
      if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      if (role === 'humas') return NextResponse.redirect(new URL('/dashboard/humas', request.url));
      return NextResponse.redirect(new URL('/dashboard/anggota', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
