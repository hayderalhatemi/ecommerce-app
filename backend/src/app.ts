import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middlewares/error.middleware';

dotenv.config();
connectDB();
