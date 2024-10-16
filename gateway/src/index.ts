import express, { Request, Response } from 'express';
// import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const port = 3000;

// Simple test route
app.get('/test', (req: Request, res: Response) => {
    res.send('Test server is working!');
});

// Start the server
app.listen(port, () => {
    console.log(`Test server listening at http://localhost:${port}`);
});
