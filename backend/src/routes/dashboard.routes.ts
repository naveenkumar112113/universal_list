import { Router } from 'express';
import { getDashboardStats, getRecentUpdates } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recent-updates', getRecentUpdates);

export default router;
