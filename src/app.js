import express from 'express';
import logRoutes from './routes/logRoutes.js';
import morgan from 'morgan';

const app = express();

//app.use(morgan('dev'));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use('/api/logs', logRoutes);

export default app;
