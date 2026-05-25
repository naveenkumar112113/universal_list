import { Router } from 'express';
import { searchModels, getTrendingSearches, getSuggestions } from '../controllers/search.controller';

const router = Router();

router.get('/', searchModels);
router.get('/models', searchModels);
router.get('/suggest', getSuggestions);
router.get('/trending', getTrendingSearches);

export default router;
