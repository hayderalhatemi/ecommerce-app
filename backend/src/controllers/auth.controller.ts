import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';