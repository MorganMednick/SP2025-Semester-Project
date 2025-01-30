import express from 'express';
import routes from './routes';
import { configureServerCookies } from './middleware/cookie';

const app = express();

configureServerCookies(app);

app.use(express.json());

app.use('/api', routes);

export default app;
