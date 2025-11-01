import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'PortLinkOrchestrator API' });
});

app.use('/auth', authRouter);
app.use('/', apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
