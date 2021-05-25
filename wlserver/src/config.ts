import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const AUTH_DETAILS = process.env.AUTH_DETAILS;
export const SAVE_FILE = process.env.SAVE_FILE || 'save.json';
export const HOSTNAME = process.env.HNAME || '127.0.0.1';
export const PORT = parseInt(process.env.PORT) || 8000;
export const ALLOWED_ORIGINS =
    (process.env.ORIGINS && process.env.ORIGINS.split(',')) || '*';
