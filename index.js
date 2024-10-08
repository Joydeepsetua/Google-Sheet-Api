import 'dotenv/config'
import express from 'express';
import createHttpError from 'http-errors';
import userRoute from './src/routes/user.js';
import orderRoute from './src/routes/order.js';
import productRoute from './src/routes/product.js';
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// default api
app.get('/', (req, res) => {
  res.send('Your project is runing ...!!');
})
app.get('/helloworld', (req, res) => {
  res.send('Hello World!');
})

//routes
app.use(userRoute);
app.use(productRoute);
app.use(orderRoute);


// This route does not exist
app.use(async (req, res, next) => {
    next(createHttpError[404]('This route does not exist'))
})

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

//listener
app.listen(PORT, () => {
    console.log(`Your project is runing on ${PORT}`);
})