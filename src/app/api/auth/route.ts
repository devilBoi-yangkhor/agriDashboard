// app/api/auth/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log(tokens)

      const response = new NextResponse(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

      // Set cookies for access and refresh tokens
      response.headers.append(
        'Set-Cookie',
        `gmail_access_token=${tokens.access_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=3600`
      );

      response.headers.append(
        'Set-Cookie',
        `gmail_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=2592000`
      );

      return response;
      
    //   return NextResponse.json(tokens);
      
    } catch (error) {
      console.error('Token exchange error:', error);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}