import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Get the origin from headers if behind proxy
        const forwardedHost = request.headers.get("x-forwarded-host");
        const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
        const origin = forwardedHost 
            ? `${forwardedProto}://${forwardedHost}`
            : new URL(request.url).origin;

        const response = NextResponse.redirect(`${origin}/`);

        // Clear the token
        response.cookies.set('token', '', {
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Logout Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}