import createHttpError from "http-errors";
import JWT from 'jsonwebtoken';


const signAccessToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1d"
        }
        JWT.sign(payload, secretKey, options, (error, token) => {
            if (error)
                return reject(createHttpError[500]());
            const expiryTime = new Date(JWT.decode(token).exp * 1000);
            resolve({ token, expiryTime });
        })
    })
}

const varifyAccessToken = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth)
        return next(createHttpError[401]());

    const bearerToken = auth.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createHttpError[401](message));
        }
        req.payload = payload;
        next();
    })
}

const signRefreshToken = (userId) => {
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "30d"
        }
        JWT.sign(payload, secretKey, options, (error, token) => {
            if (error)
                return reject(createHttpError[500]());
            const expiryTime = new Date(JWT.decode(token).exp * 1000);
            resolve({ token, expiryTime });
        })
    })
}

const varifyRefreshToken = (token) => {
    return new Promise((resolve, reject) => {
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) return reject(createHttpError[401]())
            const userId = payload.userId;
            if (!userId) return reject(createHttpError[401]())
            resolve(userId);
        })
    })
}

export { signAccessToken, varifyAccessToken, signRefreshToken, varifyRefreshToken }
