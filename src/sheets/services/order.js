import createHttpError from "http-errors";
import { authenticate } from "../connect.js";
import { v4 as uuidv4 } from 'uuid';
import { google } from 'googleapis';

const sheets = google.sheets('v4');
const SHEET_NAME = 'Orders';
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;



//---------ORDERS--------//
const fetchUserOrderByBuyerId = async (id) => {
    try {
        const sheetId = SPREADSHEET_ID;
        const usersGid = "0";
        const productsGid = "1462921446";
        const ordersGid = "799686844";

        // Helper function to fetch data from a Google Sheets URL
        const fetchData = async (gid, query) => {
            const encodedQuery = encodeURIComponent(query);
            const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=${encodedQuery}&gid=${gid}`;
            const response = await fetch(url);
            const text = await response.text();
            return JSON.parse(text.substr(47).slice(0, -2));
        };

        // Fetch User Data
        const userQuery = `select A, B, C, D where A='${id}'`;
        const userData = await fetchData(usersGid, userQuery);

        if (!userData.table.rows.length) throw createHttpError[404]("User not found");

        const userRow = userData.table.rows[0].c;

        // Fetch Orders Data
        const orderQuery = `select A, B, C, D where B='${id}'`;
        const ordersData = await fetchData(ordersGid, orderQuery);

        if (!ordersData.table.rows.length) throw createHttpError[404]("No orders found for the user");

        // Fetch Products Data for each order
        const orderRows = await Promise.all(
            ordersData.table.rows.map(async (item) => {
                const productQuery = `select A, B, C, D where A='${item.c[2]?.v}'`;
                const productData = await fetchData(productsGid, productQuery);

                if (!productData.table.rows.length) throw createHttpError[404]("Product not found");

                const product = productData.table.rows[0].c;
                return {
                    orderId: item.c[0]?.v,
                    orderBy: item.c[1]?.v,
                    orderStatus: item.c[3]?.v,
                    productId: item.c[2]?.v,
                    productName: product[2]?.v,
                    productPrice: product[3]?.v,
                };
            })
        );

        return {
            userId: userRow[0]?.v,
            userName: userRow[1]?.v,
            userEmail: userRow[2]?.v,
            userAge: userRow[3]?.v,
            orders: orderRows,
        };
    } catch (err) {
        console.error("FetchUserOrderByUserId error:", err);
        throw err;
    }
};

const insertOrder = (requestBody) => {
    return new Promise(async (resolve, reject) => {
      const auth = await authenticate();
      try {
        const { productId, userId } = requestBody;
        const id = uuidv4();
        const newData = [[id, userId, productId, "Paid"]];
  
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

export { fetchUserOrderByBuyerId, insertOrder };
