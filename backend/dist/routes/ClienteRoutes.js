"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClienteController_1 = __importDefault(require("@controllers/Cliente/ClienteController"));
const router = (0, express_1.Router)();
router.post("/", ClienteController_1.default.create);
router.get("/", ClienteController_1.default.findAll);
router.get("/:id", ClienteController_1.default.findOne);
router.put("/:id", ClienteController_1.default.update);
router.delete("/:id", ClienteController_1.default.delete);
exports.default = router;
