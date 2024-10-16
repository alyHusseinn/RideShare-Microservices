import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyPaser from 'body-parser';
import cookieParser from 'cookie-parser';
dotenv.config();
// import { db } from './config/db';
// import { createProxyMiddleware } from 'http-proxy-middleware';
import usserRouter from './routes/userRouter';

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyPaser.json());

// Simple test route
app.get('/test', (req: Request, res: Response) => {
    res.send('Test server is working!');
});

app.use('/api/users', usserRouter);

// Start the server
app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});
