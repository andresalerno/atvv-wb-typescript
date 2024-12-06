import { Router } from "express";
import ClienteController from "@controllers/Cliente/ClienteController";


const router = Router();

router.post("/", ClienteController.create);
router.get("/", ClienteController.findAll);
router.get("/:id", ClienteController.findOne);
router.put("/:id", ClienteController.update);
router.delete("/:id", ClienteController.delete);

export default router;
