import { Router } from 'express';
import ProdutoController from '@controllers/Produto/ProdutoController';

const router = Router();

router.post('/', ProdutoController.create);
router.get('/', ProdutoController.findAll);
router.get('/:id', ProdutoController.findOne);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);

export default router;
