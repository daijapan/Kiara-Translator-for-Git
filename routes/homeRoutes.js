import express from 'express';
const router = express.Router();

import { getHome,getDocumentation} from '../controllers/homeController.js';

// Define routes for the OpenAI resource
router.get('/', getHome);
router.get('/documentation', getDocumentation);

export default router;
