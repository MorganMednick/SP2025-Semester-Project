import express from 'express';
import routes from './routes';
import { configureServerCookies, configureCors, configureServerSession } from './middleware/auth';

const app = express();

configureCors(app);
configureServerCookies(app);
configureServerSession(app);

app.use(express.json());

app.use('/api', routes);

export default app;
