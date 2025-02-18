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
