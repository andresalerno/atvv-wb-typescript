"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { ClienteController } from "../controllers/Cliente/ClienteController";
const ClienteController_1 = require("@controllers/Cliente/ClienteController");
const router = (0, express_1.Router)();
// Rotas para CRUD de clientes
router.post("/", ClienteController_1.ClienteController.create);
router.get("/", ClienteController_1.ClienteController.findAll);
router.get("/:id", ClienteController_1.ClienteController.findOne);
router.put("/:id", ClienteController_1.ClienteController.update);
router.delete("/:id", ClienteController_1.ClienteController.delete);
router.get("/top-clientes", ClienteController_1.ClienteController.getTopClientes);
router.get("/genero/:genero", ClienteController_1.ClienteController.getClientesByGenero);
// router.get("/agrupados-por-genero", ClienteController.getClientesGroupedByGenero);
// router.get("/bottom-clientes", ClienteController.getBottom10Clientes);
// router.get("/top5-clientes", ClienteController.getTop5Clientes);
exports.default = router;
