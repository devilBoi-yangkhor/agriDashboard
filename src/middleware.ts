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

