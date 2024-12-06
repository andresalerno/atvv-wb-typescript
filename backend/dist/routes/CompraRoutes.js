"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CompraController_1 = __importDefault(require("@controllers/Compra/CompraController"));
const router = (0, express_1.Router)();
router.post('/', CompraController_1.default.create);
router.get('/', CompraController_1.default.findAll);
router.get('/:id', CompraController_1.default.findOne);
router.put('/:id', CompraController_1.default.update);
router.delete('/:id', CompraController_1.default.delete);
exports.default = router;
