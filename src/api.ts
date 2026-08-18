import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Server is running',
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default app;
