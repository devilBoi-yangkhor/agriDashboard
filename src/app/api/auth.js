// pages/api/auth.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  console.log(req.method)
  if (req.method === 'POST') {
    const { code } = req.body;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);
      res.status(200).json(tokens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}