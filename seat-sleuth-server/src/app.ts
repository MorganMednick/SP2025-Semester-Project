import dotenv from 'dotenv';
dotenv.config(); // Needed for alternate run environments. DO NOT DELETE PLEASE - Jayce
import express from 'express';
import { configureServerCookies, configureCors, configureServerSession } from './middleware/auth';
import routes from './routes';

const app = express();

configureCors(app);
configureServerCookies(app);
configureServerSession(app);

app.use(express.json());

app.use('/api', routes);

export default app;
