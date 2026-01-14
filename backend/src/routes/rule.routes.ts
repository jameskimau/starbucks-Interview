import { Router } from 'express';
import { createRule, listRules, toggleRule } from '../controllers/rule.controller';

const router = Router();

router.post('/rules', createRule);
router.get('/rules', listRules);
router.patch('/rules/:id/toggle', toggleRule);

export default router;

