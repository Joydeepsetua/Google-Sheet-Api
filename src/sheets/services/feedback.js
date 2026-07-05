import createHttpError from "http-errors";
import { authenticate } from "../connect.js";
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';

const sheets = google.sheets('v4');
const SHEET_NAME = 'Feedbacks';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

//---------FEEDBACKS--------//
const insertFeedback = (requestBody) => {
  return new Promise(async (resolve, reject) => {
    const auth = await authenticate();
    try {
      const {
        feedbackType,
        module,
        description,
        name,
        phone,
        image,
        appVersion,
        buildNumber,
        osVersion,
        deviceModel,
      } = requestBody;
      const id = uuidv4();
      const newData = [[
        id,
        feedbackType,
        module,
        description,
        name,
        phone,
        image,
        appVersion,
        buildNumber,
        osVersion,
        deviceModel,
      ]];

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${"A:A"}`,
        auth,
      });
      const rows = response.data.values?.length || 0;

      const data = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rows + 1}:K${rows + 1}`,
        valueInputOption: 'RAW',
        auth,
        requestBody: {
          values: newData,
        },
      });
      if (data.status !== 200)
        return reject(createHttpError[500]());
      requestBody.id = id;
      return resolve(requestBody);
    } catch (err) {
      console.error('InsertFeedback error:', err);
      return reject(err)
    }
  })
}

const fetchFeedbackList = (page = 1, limit = 20) => {
  return new Promise(async (resolve, reject) => {
    const auth = await authenticate();
    const range = `A:K`;

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${range}`,
        auth,
      });
      if (response.status !== 200)
        return reject(createHttpError[500]());

      const rows = response.data.values || [];
      rows.shift(); // remove the header row

      const total = rows.length;
      const totalPages = Math.ceil(total / limit) || 0;
      const offset = (page - 1) * limit;
      const paginatedRows = rows.slice(offset, offset + limit);

      const data = paginatedRows.map((feedback) => {
        return {
          id: feedback[0],
          feedbackType: feedback[1],
          module: feedback[2],
          description: feedback[3],
          name: feedback[4],
          phone: feedback[5],
          image: feedback[6],
          appVersion: feedback[7],
          buildNumber: feedback[8],
          osVersion: feedback[9],
          deviceModel: feedback[10],
        };
      });

      return resolve({
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      });
    } catch (err) {
      console.error('FetchFeedbackList error:', err);
      return reject(err);
    }
  });
};


export { insertFeedback, fetchFeedbackList };
