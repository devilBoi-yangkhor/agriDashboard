// app/api/watch.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { access_token } = req.body;
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    
    try {
      const response = await gmail.users.watch({
        userId: 'me',
        requestBody: {
          labelIds: ['INBOX'],
          topicName: process.env.PUBSUB_TOPIC_NAME
        }
      });
      
      res.status(200).json(response.data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}