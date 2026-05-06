import { NextResponse } from "next/server";

// List of protected routes
const protectedRoutes = [
  '/dashboard',
  '/user-management',
  '/master-management',
  '/product-management',
  '/settings'
];
// const protectedRoutes = [''];

export function middleware(request: any) {
    const token = request.cookies.get("token")?.value;
    // console.count('Token:', token);

    // If token exists and user is trying to access login or signin page, redirect to dashboard
    if (token && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/signin')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If no token and user tries to access any protected route, redirect to login
    const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/signin', '/dashboard', '/user-management/:path*','/master-management/:path*','/product-management/:path*', '/((?!api/).*)']
};


///
// import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server';

// const protectedRoutes = [
//   '/dashboard',
//   '/user-management',
//   '/master-management',
//   '/product-management',
//   '/settings'
// ];

// export function middleware(request: NextRequest) {
//     const token = request.cookies.get("token")?.value;
//     const { pathname } = request.nextUrl;

//     // 1. If token exists and user is on the Login page (/), send to Dashboard
//     if (token && pathname === '/') {
//         return NextResponse.redirect(new URL('/dashboard', request.url));
//     }

//     // 2. If NO token and trying to access a protected route, send to Login (/)
//     const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

//     if (!token && isProtectedRoute) {
//         // Changed redirect from '/signin' to '/' because your login is at the root
//         return NextResponse.redirect(new URL('/', request.url));
//     }

//     return NextResponse.next();
// }

// // 3. Optimized Matcher: This tells Next.js exactly which files to IGNORE
// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except for the ones starting with:
//          * - api (important: this allows your auth.js to run!)
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico (favicon file)
//          */
//         '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     ],
// };