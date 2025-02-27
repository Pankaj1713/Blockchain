import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import { setupSwagger } from './src/swagger.js';
import startCronJob from './src/services/cronJob.js';

dotenv.config();

const app = express();
app.use(express.json());

setupSwagger(app);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);
// startCronJob()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
