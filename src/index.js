import express from 'express';
import cors from 'cors';
import { PrismaClient } from './generated/prisma/index.js';

import { config } from './config/config.js';
import routes from './routes/authRoutes.js';

const app = express();

const prisma = new PrismaClient();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(express.json());

app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

app.use(routes);

app.listen(config.server.port, config.server.host, () => {
    console.log(`Server running at: http://${config.server.host}:${config.server.port}`);
});

process.on('beforeExit', async () => {
    await prisma.$disconnect();
});