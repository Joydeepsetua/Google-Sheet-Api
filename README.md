# How to insert data in Google Sheets / Spreadsheet in Node.JS

To insert data (name, email, and age) into the last row of a Spreadsheet using the Google Sheets API in Node.js, follow the steps below.

## Prerequisites

Make sure you have:
- A service account JSON key file for authentication.
- The `googleapis` package installed in your Node.js project.

### Step-by-Step Guide to Enable Google Sheets API and Set Up Node.js Project

## Step 1: Enable the Google Sheets API

1. **Go to the Google Cloud Console**:
   - Open [Google Cloud Console](https://console.cloud.google.com/).

2. **Create a New Project or Select an Existing One**:
   - If you don’t have a project yet, click on **"Select a project"** at the top of the page and choose **"New Project"**. Follow the prompts to create your project.

3. **Navigate to APIs & Services > Library**:
   - On the left-hand sidebar, go to **"APIs & Services"** and then click on **"Library"**.

4. **Search for "Google Sheets API" and Enable It**:
   - In the search bar, type **"Google Sheets API"**.
   - Click on **"Google Sheets API"** and then click the **"Enable"** button.

5. **Navigate to APIs & Services > Credentials**:
   - After enabling the API, go back to **"APIs & Services"** on the left-hand sidebar and select **"Credentials"**.

6. **Click on Create Credentials**:
   - Click on the **"Create Credentials"** button.
   - Choose either **"OAuth client ID"** or **"Service Account"** based on your use case.
     - **For a simple public script**, a **Service Account** is easier as it doesn’t require user login.

## Step 2: Install Google API Client Library

In your Node.js project, install the `googleapis` package:

   ```bash
   npm install googleapis
   ```

## Step 3: Set Up Your Script

Here’s a basic script to insert data into a Google Sheet using the Google Sheets API:

```javascript
const { google } = require('googleapis');
const sheets = google.sheets('v4');

// Path to your service account key file
const SERVICE_ACCOUNT_FILE = 'path/to/your/service-account-file.json';

// Spreadsheet ID from the URL of your spreadsheet
const SPREADSHEET_ID = 'your-spreadsheet-id';

// Sheet name where you want to insert the data
const SHEET_NAME = 'Sheet1';

// Authenticate using a service account
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Function to insert data into the last row
async function insertData(auth, name, email, age) {
  try {
    // Get the last row number
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`, // Check the first column for existing data
      auth,
    });

    const numRows = response.data.values ? response.data.values.length : 0;

    // Define the new data to insert
    const newData = [[name, email, age]];

    // Insert the data into the next available row
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${numRows + 1}:C${numRows + 1}`,
      valueInputOption: 'RAW',
      auth,
      requestBody: {
        values: newData,
      },
    });

    console.log(`Inserted data: ${name}, ${email}, ${age} into row ${numRows + 1}`);
  } catch (err) {
    console.error('The API returned an error:', err);
  }
}

// Main function to be called
async function main() {
  const auth = await authenticate();
  const name = 'John Doe';
  const email = 'john.doe@example.com';
  const age = 30;

  await insertData(auth, name, email, age);
}

main();

```

## Step 4: Configure Your Service Account

Ensure Your Service Account Has Access to Your Google Sheet:
   - Go to your Google Sheets spreadsheet.
   - Click on the **"Share"** button in the top right corner.
   - Add the email address of your service account as an **editor**.

## Important Notes

- **Permissions**: 
  - Your service account must have **edit permissions** to the spreadsheet to make any changes.
  
- **Public URL**:
  - Using a public URL means the sheet can be viewed by anyone with the link. However, you still need **authentication** (through your service account) to edit the spreadsheet.
  
- **Insert Location**:
  - The script appends data starting from the first available row in the specified range. 
  - Make sure to adjust the range and options as necessary to fit your specific use case.

