import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import openaiRoutes from './routes/openaiRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import homeRoutes from './routes/homeRoutes.js';

import { runTheTranslationServices } from './services/runTheTranslationServices.js';

// init the configuration environment
dotenv.config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);

app.set('view engine', 'ejs');

export const completionUrl = process.env.COMPLETION_URL || 'https://api.openai.com/v1/engines/davinci/completions';
export const model = process.env.MODEL || 'gpt-3.5-turbo';
export const secret = process.env.OPEN_API_KEY;
export const github_user_token = process.env.GITHUB_USER_TOKEN;
export const github_base_url = process.env.GITHUB_BASE_URL || 'https://api.github.com';
export const github_api_version = process.env.GITHUB_API_VERSION || '2022-11-28';

// Use routes
app.use('/api', openaiRoutes);
app.use('/api/github', githubRoutes);
app.use('/web/admin', adminRoutes);

app.use('/', homeRoutes);

// Set up the Express app to listen on a specific port
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  runTheTranslationServices();
});
