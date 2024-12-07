"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServicoController_1 = __importDefault(require("@controllers/Servico/ServicoController"));
const router = (0, express_1.Router)();
// Rotas para serviços
router.post('/', ServicoController_1.default.create);
router.get('/', ServicoController_1.default.findAll);
router.get('/:id', ServicoController_1.default.findOne);
router.put('/:id', ServicoController_1.default.update);
router.delete('/:id', ServicoController_1.default.delete);
router.get("/mais-consumidos", ServicoController_1.default.getServicosMaisConsumidos);
router.get("/servicos-mais-consumidos-por-genero", ServicoController_1.default.getServicosMaisConsumidosPorGenero);
exports.default = router;
