import { Router } from 'express';
import ServicoController from '@controllers/Servico/ServicoController';


const router = Router();

// Rotas para serviços
router.post('/', ServicoController.create);
router.get('/', ServicoController.findAll);
router.get('/:id', ServicoController.findOne);
router.put('/:id', ServicoController.update);
router.delete('/:id', ServicoController.delete);

router.get("/mais-consumidos", ServicoController.getServicosMaisConsumidos);

router.get("/servicos-mais-consumidos-por-genero", ServicoController.getServicosMaisConsumidosPorGenero);



export default router;
