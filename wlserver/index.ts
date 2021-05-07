import express from 'express';
import { expressLogger } from './src/logger';

const app = express();
const PORT = 8000;

app.use(expressLogger);

app.get('/', (_, res) => res.send('Express + TypeScript Server'));

app.listen(PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${PORT}`)
})
