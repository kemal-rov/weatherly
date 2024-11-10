import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { aggregateCityData } from './services/aggregator.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/weather', (req: express.Request, res: express.Response) => {
  aggregateCityData(req.query.city as string)
    .then((data) => res.json(data))
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    });
});

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
