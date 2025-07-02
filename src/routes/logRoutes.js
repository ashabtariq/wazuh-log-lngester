import express from 'express';
import { ingestLog, getLogs } from '../controllers/logController.js';
import apiKeyAuth from '../middlewares/apiKeyAuth.js';
import rateLimiter from '../middlewares/rateLimiter.js';
import genAPIkey from '../utils/generateAPIkey.js';

const router = express.Router();

router.use(apiKeyAuth);
router.use(rateLimiter);

router.post('/', ingestLog);
router.get('/', getLogs);
router.get('/key', genAPIkey)

export default router;
