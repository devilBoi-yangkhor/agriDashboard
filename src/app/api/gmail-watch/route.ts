import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID, // Remove NEXT_PUBLIC_ for server-side
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Retrieve access token from cookies
    const cookies = req.headers.get('cookie')?.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const accessToken = cookies?.['gmail_access_token'];
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token found' }, { status: 401 });
    }

    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Test token validity
    try {
      await gmail.users.getProfile({ userId: 'me' });
    } catch (authError) {
      console.error('Invalid access token:', authError);
      return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 401 });
    }

    const watchResponse = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: 'projects/crmg2c/topics/crm-push-notification',
        labelIds: ['INBOX'],
      },
    });

    return NextResponse.json({
      success: true,
      historyId: watchResponse.data.historyId,
    });
  } catch (error: any) {
    console.error('Error setting up Gmail watch:', error.response?.data || error);
    return NextResponse.json(
      { error: 'Failed to set up Gmail watch', details: error.response?.data },
      { status: 500 }
    );
  }
}