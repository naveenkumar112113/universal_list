import { Router } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getCategories);
router.post('/', authenticate, authorize(['Super Admin', 'Admin']), createCategory);
router.put('/:id', authenticate, authorize(['Super Admin', 'Admin']), updateCategory);
router.delete('/:id', authenticate, authorize(['Super Admin', 'Admin']), deleteCategory);

export default router;
