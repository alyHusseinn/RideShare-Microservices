import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import env from './config/env';
import { checkJwt } from './middleware/checkJwt';
import userRouter from './routes/userRouter';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

// Simple test route
app.get('/test', (req: Request, res: Response) => {
    res.send('Test server is working!');
});

// User routes
app.use('/api/users', userRouter);

// Handle all HTTP methods for trips
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
// Handle other routes if needed
app.use(
    '/api/locations',
    checkJwt,
    createProxyMiddleware({
        target: env.LOCATIONS_SERVICE_URL,
        changeOrigin: true,
        ws: true,
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
    })
);

// Start the server
app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});