import express from 'express';
const router = express.Router();
import { translate_content } from '../controllers/translateController.js';

// Define routes for the OpenAI resource
router.post('/translate', translate_content);

export default router;
