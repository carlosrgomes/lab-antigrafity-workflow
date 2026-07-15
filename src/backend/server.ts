import express from 'express';
import path from 'path';
import router from './routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

const publicPath = path.join(process.cwd(), 'public');
app.use(express.static(publicPath));

app.use('/api', router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

export default app;
