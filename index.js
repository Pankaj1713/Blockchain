import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/userRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import { setupSwagger } from './src/swagger.js';
import startCronJob from './src/services/cronJob.js';
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(cors({
    origin: "*", 
    methods:"*",
    allowedHeaders: "*"
}));
app.use(express.json());

setupSwagger(app);
app.use('/users', userRoutes);
app.use('/transactions', transactionRoutes);
startCronJob()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
