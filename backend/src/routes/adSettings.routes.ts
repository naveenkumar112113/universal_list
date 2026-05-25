import { Router } from 'express';
import { getAdSettings, updateAdSettings } from '../controllers/adSettings.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getAdSettings);
router.put('/', authenticate, authorize(['Super Admin', 'Admin']), updateAdSettings);

export default router;
