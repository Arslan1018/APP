import { Router } from 'express';
import * as items from '../controllers/item.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/menu/:menuId', items.getItems);
router.get('/:id/ar', items.getItemAR); // public AR endpoint
router.post('/', authenticate, authorize('RESTAURANT_OWNER'), items.createItem);
router.put('/:id', authenticate, authorize('RESTAURANT_OWNER'), items.updateItem);
router.delete('/:id', authenticate, authorize('RESTAURANT_OWNER'), items.deleteItem);
router.post('/:id/ar-model', authenticate, authorize('RESTAURANT_OWNER'), items.upsertARModel);

export default router;
