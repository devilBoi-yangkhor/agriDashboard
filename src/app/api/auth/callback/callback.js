// pages/api/auth/callback.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { code } = req.query;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens securely (e.g., HTTP-only cookies or Django backend)
    res.setHeader('Set-Cookie', [
      `gmail_access_token=${tokens.access_token}; HttpOnly; Secure; Path=/`,
      `gmail_refresh_token=${tokens.refresh_token}; HttpOnly; Secure; Path=/`,
    ]);

    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
}