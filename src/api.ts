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

interface Image {
  id: string;
  name: string;
  url: string;
  environment: 'dev' | 'staging' | 'production';
  createdAt: string;
}

const images: Image[] = [];

app.post('/api/images', (req: Request, res: Response) => {
  const { name, url, environment = 'dev' } = req.body;
  if (!name || !url) {
    return res.status(400).json({ error: 'name and url are required' });
  }
  const image: Image = {
    id: Date.now().toString(),
    name,
    url,
    environment,
    createdAt: new Date().toISOString(),
  };
  images.push(image);
  res.status(201).json(image);
});

app.get('/api/images', (_req: Request, res: Response) => {
  res.status(200).json(images);
});

export default app;
