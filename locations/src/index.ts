import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import 'dotenv/config';
import socketHandler from './socketHandlers';
import connectDB from './config/db';
import matchRouter from './routes/matchTripRouter';
import env from './config/env';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api', matchRouter(io));

httpServer.listen(env.PORT, async () => {
    await connectDB();
    socketHandler(io);
    console.log(`Server is running on port ${env.PORT}`);
});