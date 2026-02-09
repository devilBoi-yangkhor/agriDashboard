import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const initiateAuth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gmail/start/`);
    // console.log(response.data)
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to initiate authentication');
  }
};

export const fetchEmails = async (query = 'is:unread category:primary', maxResults = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/gmail/emails/`, {
      params: { query, max_results: maxResults },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch emails');
  }
};

export const markEmailAsRead = async (messageId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/gmail/emails/mark-read/`, {
      message_id: messageId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to mark email as read');
  }
};