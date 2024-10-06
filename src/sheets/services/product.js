import createHttpError from "http-errors";
import { authenticate } from "../connect.js";
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';


const sheets = google.sheets('v4');
const SHEET_NAME = 'Products';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

//---------PRODUCTS--------//
const insertProduct = (requestBody) => {
  return new Promise(async (resolve, reject) => {
    const auth = await authenticate();
    try {
      const { productName, price, createdBy } = requestBody;
      const id = uuidv4();
      const newData = [[id, createdBy, productName, price]];

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!${"A:A"}`,
        auth,
      });
      const rows = response.data.values.length || 0;

      const data = await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A${rows + 1}:D${rows + 1}`,
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
      console.error('InsertData error:', err);
      return reject(err)
    }
  })
}

const fetchUserProductByUserId = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sheetId = SPREADSHEET_ID; // Same Sheet ID for both Users and Products
      const usersGid = "0"; // GID for Users Sheet
      const productsGid = "1462921446"; // GID for Products Sheet

      // Fetch data from Users Sheet (GID 0)
      const queryUsers = `select A, B, C, D where A='${id}'`; // Adjust columns for Users
      const encodedQueryUsers = encodeURIComponent(queryUsers);

      const urlUsers = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=${encodedQueryUsers}&gid=${usersGid}`;

      const responseUsers = await fetch(urlUsers);
      const textUsers = await responseUsers.text();
      const jsonUsers = JSON.parse(textUsers.substr(47).slice(0, -2));

      if (!jsonUsers.table.rows.length) {
        return reject(createHttpError[404]("User not found"));
      }

      const userRow = jsonUsers.table.rows[0].c;
      // console.log(userRow);

      // Fetch data from Products Sheet (GID 1)
      const queryProducts = `select A, B, C, D where B='${id}'`; // Adjust columns for Products
      const encodedQueryProducts = encodeURIComponent(queryProducts);

      const urlProducts = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=${encodedQueryProducts}&gid=${productsGid}`;

      const responseProducts = await fetch(urlProducts);
      const textProducts = await responseProducts.text();
      const jsonProducts = JSON.parse(textProducts.substr(47).slice(0, -2));
      if (!jsonProducts.table.rows.length) {
        return reject(createHttpError[404]("Product not found for the user"));
      }

      const productRow = jsonProducts.table.rows.map((item) => {
        return {
          "productId": item.c[0]?.v,
          "productName": item.c[2]?.v,
          "productPrice": item.c[3]?.v,
        }
      });
      return resolve({
        userId: userRow[0]?.v,
        userName: userRow[1]?.v,
        userEmail: userRow[2]?.v,
        userAge: userRow[3]?.v,
        products: productRow
      });
    } catch (err) {
      console.error('FetchUserProductById error:', err);
      return reject(err);
    }
  });
};


export { insertProduct, fetchUserProductByUserId };