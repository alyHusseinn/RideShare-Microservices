import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import env from './config/env';
import { checkJwt } from './middleware/checkJwt';
import userRouter from './routes/userRouter';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import http, { IncomingMessage } from 'http';
import { Socket } from 'net';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/test', (req: Request, res: Response) => {
    res.send('Test server is working!');
});

app.use('/api/users', userRouter);

app.use('/api/trips', checkJwt, createProxyMiddleware({
    target: env.TRIPS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/trips': '/' }, // Adjust path as needed
    on: {
        proxyReq: (proxyReq, req: any, res: any) => {
            proxyReq.setHeader('x-user-id', req.user.id);
            proxyReq.setHeader('x-user-role', req.user.role);
            proxyReq.setHeader('x-user-username', req.user.username);
            proxyReq.write(JSON.stringify(req.body));
        },
        error: (err, req, res) => {
            console.error('Proxy Error:', err);
            res.status(500).send('Proxy Error: Unable to reach target service');
        }
    }
}));

app.use(
    '/socket',
    checkJwt,
    createProxyMiddleware({
        target: env.LOCATIONS_SERVICE_URL,
        changeOrigin: true,
        ws: true,
    })
);

const server = http.createServer(app);

// Handle WebSocket upgrades specifically
server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const proxy = createProxyMiddleware({
        target: env.LOCATIONS_SERVICE_URL,
        changeOrigin: true,
        ws: true, // Enable WebSocket support
    });
    proxy.upgrade(req, socket, head);
});

server.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});