import { Router } from 'express';
import multer from 'multer';
import { getModels, getModelById, createModel, updateModel, deleteModel, bulkImportModels, requestModel } from '../controllers/model.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getModels);
router.post('/request', requestModel);
router.get('/:id', getModelById);
router.post('/', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), createModel);
router.put('/:id', authenticate, authorize(['Super Admin', 'Admin', 'Editor']), updateModel);
router.delete('/:id', authenticate, authorize(['Super Admin', 'Admin']), deleteModel);
router.post('/bulk-import', authenticate, authorize(['Super Admin', 'Admin']), upload.single('file'), bulkImportModels);

export default router;
