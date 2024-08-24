import createHttpError from "http-errors";
import { authenticate } from "../connect.js";
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

const sheets = google.sheets('v4');
const SHEET_NAME = 'User';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const insertData = (requestBody) => {
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        const range = `C:C`; // Email Column
        
        try {
            const { name, email, age, password } = requestBody;
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!${range}`,
                auth,
            });
            const rows = response.data.values.length || 0;
            if (response.status !== 200 || rows < 1)
                return reject(createHttpError[500]());
            const emailExists = response.data.values.flat().includes(email);
            if (emailExists) {
                return reject(createHttpError[409](`${email} is already exist.`));
            }
            const id = uuidv4();
            const newData = [[id, name, email, age, password]];
            const data = await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!A${rows + 1}:E${rows + 1}`,
                valueInputOption: 'RAW',
                auth,
                requestBody: {
                    values: newData,
                },
            });
            if (data.status !== 200)
                return reject(createHttpError[500]());
            requestBody.id = id;
            delete requestBody.password;
            return resolve(requestBody);
        } catch (err) {
            console.error('InsertData error:', err);
            return reject(err)
        }
    })
}
const updateUser = (request) => {
 
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        const range = `A:E`;

        try {
            const { name, age } = request.body;
            const { id } = request.params;
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!${range}`,
                auth,
            });
            const rows = response.data.values;
            if (response.status !== 200 || rows?.length < 1)
                return reject(createHttpError[500]());
            const rowIndex = rows.findIndex(row => row[0] === id);

            if (rowIndex === -1)
                return reject(createHttpError[400]("User not found"));

            rows[rowIndex][1] = name;
            rows[rowIndex][3] = age;
            const data = await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!A${rowIndex + 1}:E${rowIndex + 1}`,
                valueInputOption: 'RAW',
                auth,
                requestBody: {
                    values: [rows[rowIndex]],
                },
            });
            if (data.status !== 200)
                return reject(createHttpError[500]());
            const user = [rows[rowIndex]];
            return resolve({
                id: user[0][0],
                name: user[0][1],
                email: user[0][2],
                age: user[0][3],
            });
        } catch (err) {
            console.error('UpdateUser error:', err);
            return reject(err)
        }
    })
}
const fetchUser = (requestBody) => {
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        const range = `A:E`;
        
        try {
            const { email, password } = requestBody;
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!${range}`,
                auth,
            });
            const rows = response.data.values;
            if (response.status !== 200)
                return reject(createHttpError[500]());
            if (!rows || rows.length < 1)
                return reject(createHttpError[404]("Invalid credentials"))

            const matchingRows = rows.filter(row =>
                row[2] === email && row[4] === password
            );
            if (matchingRows.length < 1)
                return reject(createHttpError[404]("Invalid credentials"))
            return resolve({
                id: matchingRows[0][0],
                name: matchingRows[0][1],
                email: matchingRows[0][2],
                age: matchingRows[0][3],
            });
        } catch (err) {
            console.error('FetchUser error:', err);
            return reject(err)
        }
    })
}
const fetchUserByIb = (id) => {
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        const range = `A:E`;

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!${range}`,
                auth,
            });
            const rows = response.data.values;
            if (response.status !== 200)
                return reject(createHttpError[500]());
            if (!rows || rows.length < 1)
                return reject(createHttpError[404]("User not found"));

            const matchingRows = rows.find(row => row[0] === id);

            if (!matchingRows)
                return reject(createHttpError[404]("User not found"));

            return resolve({
                id: matchingRows[0],
                name: matchingRows[1],
                email: matchingRows[2],
                age: matchingRows[3],
            });
        } catch (err) {
            console.error('FetchUserById error:', err);
            return reject(err);
        }
    });
};

const fetchUsersList = () => {
    return new Promise(async (resolve, reject) => {
        const auth = await authenticate();
        const range = `A:E`;

        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: `${SHEET_NAME}!${range}`,
                auth,
            });
            const rows = response.data.values;
            if (response.status !== 200)
                return reject(createHttpError[500]());
            rows.shift()
            if (!rows || rows.length < 1)
                return resolve([])
            const data = rows.map((user) => {
                let item = {}
                item.id = user[0]
                item.name = user[1]
                item.email = user[2]
                item.age = user[3]
                item.password = user[4]
                return item;
            })
            return resolve(data);
        } catch (err) {
            console.error('FetchUser error:', err);
            return reject(err)
        }
    })
}

export { insertData, fetchUser, fetchUsersList, fetchUserByIb, updateUser };