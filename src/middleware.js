import { NextResponse } from 'next/server';
import { COOKIE_STORAGE, ROUTES } from './utils/constant/constant.helper';

const PROTECTED_ROUTES = [
  ROUTES.PLAY_HISTORY,
  ROUTES.PROFILE,
  ROUTES.MY_AUCTIONS,
];

export function middleware(request) {
  // Access the `Cookie` header
  const cookieHeader = request.headers.get('cookie');

  // Parse cookies from the header
  const cookies = Object.fromEntries(
    cookieHeader
      ?.split('; ')
      .map((cookie) => cookie.split('=').map(decodeURIComponent)) || [],
  );

  // Access the specific cookie
  const userCookie = cookies[COOKIE_STORAGE.USER];

  // Parse the JSON value if the cookie exists
  const user = userCookie ? JSON.parse(userCookie) : null;

  if (
    !user?.accessToken &&
    PROTECTED_ROUTES.includes(request.nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL(ROUTES.BASE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon(?:-\\d+x\\d+)?\\.png).*)',
  ],
};
