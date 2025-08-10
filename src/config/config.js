import dotenv from 'dotenv';

dotenv.config();

export const config = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRATION,
    },
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
    },
}