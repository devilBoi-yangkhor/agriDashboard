// app/api/auth/refresh/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const cookies = req.headers.get('cookie')?.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const refreshToken = cookies?.['gmail_refresh_token'];
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await oauth2Client.refreshAccessToken();
    const response = new NextResponse(JSON.stringify({ access_token: credentials.access_token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    response.headers.append(
      'Set-Cookie',
      `gmail_access_token=${credentials.access_token}; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=3600`
    );

    return response;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}