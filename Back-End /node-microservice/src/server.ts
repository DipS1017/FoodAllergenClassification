import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

