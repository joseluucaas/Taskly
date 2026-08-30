import dotenv from 'dotenv';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env.test');

dotenv.config({
  path: envPath,
});

process.env.NODE_ENV ??= 'test';