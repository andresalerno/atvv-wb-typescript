import { Router } from 'express';
import ProdutoController from '@controllers/Produto/ProdutoController';

const router = Router();

router.post('/', ProdutoController.create);
router.get('/', ProdutoController.findAll);
router.get('/:id', ProdutoController.findOne);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.delete);

router.get("/mais-consumidos", ProdutoController.getProdutosMaisConsumidos);

router.get("/produtos-mais-consumidos-por-genero", ProdutoController.getProdutosMaisConsumidosPorGenero);




export default router;
