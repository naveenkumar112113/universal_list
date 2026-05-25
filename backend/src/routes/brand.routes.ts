import { Router } from 'express';
import { getBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getBrands);
router.post('/', authenticate, authorize(['Super Admin', 'Admin']), createBrand);
router.put('/:id', authenticate, authorize(['Super Admin', 'Admin']), updateBrand);
router.delete('/:id', authenticate, authorize(['Super Admin', 'Admin']), deleteBrand);

export default router;
