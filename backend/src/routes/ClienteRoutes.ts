import { Router } from "express";
import ClienteController from "@controllers/Cliente/ClienteController";

const router = Router();

// Rotas para CRUD de clientes
router.post("/", ClienteController.create);
router.get("/", ClienteController.findAll);
router.get("/:id", ClienteController.findOne);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);


router.get("/top-clientes", ClienteController.getTopClientes);

router.get("/genero/:genero", ClienteController.getClientesByGenero);

router.get("/agrupados-por-genero", ClienteController.getClientesGroupedByGenero);

router.get("/bottom-clientes", ClienteController.getBottom10Clientes);

router.get("/top5-clientes", ClienteController.getTop5Clientes);



export default router;
