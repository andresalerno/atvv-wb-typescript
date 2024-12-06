import { Router } from 'express';
import CompraController from '@controllers/Compra/CompraController';

const router = Router();


router.post('/', CompraController.create); 
router.get('/', CompraController.findAll); 
router.get('/:id', CompraController.findOne);
router.put('/:id', CompraController.update);
router.delete('/:id', CompraController.delete);

export default router;
