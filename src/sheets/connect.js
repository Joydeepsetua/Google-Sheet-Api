import { google } from 'googleapis';

// Path to your service account key file
const SERVICE_ACCOUNT_FILE = './service_account.json';

// Authenticate using a service account
const authenticate = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

export { authenticate };