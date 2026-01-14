import { Router } from 'express';
import { simulate } from '../controllers/simulate.controller';

const router = Router();

router.post('/simulate', simulate);

export default router;

