"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProdutoController_1 = __importDefault(require("@controllers/Produto/ProdutoController"));
const router = (0, express_1.Router)();
router.post('/', ProdutoController_1.default.create);
router.get('/', ProdutoController_1.default.findAll);
router.get('/:id', ProdutoController_1.default.findOne);
router.put('/:id', ProdutoController_1.default.update);
router.delete('/:id', ProdutoController_1.default.delete);
router.get("/mais-consumidos", ProdutoController_1.default.getProdutosMaisConsumidos);
router.get("/produtos-mais-consumidos-por-genero", ProdutoController_1.default.getProdutosMaisConsumidosPorGenero);
exports.default = router;
