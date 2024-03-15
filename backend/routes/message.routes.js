import express from 'express';
import { sendMsg, getMsgs } from '../controllers/message.controller.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/:id', protectRoute, getMsgs)
router.post('/send/:id', protectRoute, sendMsg)

export default router;