import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(express.json());

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Autenticación


// Usuario

console.log("Esto está siendo ejecutado desde el archivo app.ts");
export default app;