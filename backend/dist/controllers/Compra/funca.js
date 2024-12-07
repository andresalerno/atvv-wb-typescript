"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addItensCompra;
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
const Produto_1 = __importDefault(require("@models/Produto"));
const Servico_1 = __importDefault(require("@models/Servico"));
function addItensCompra(itensCompra, compraId, transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let valorTotal = 0;
        for (const item of itensCompra) {
            const { tipo, itemId, quantidade } = item;
            if (tipo === 'produto') {
                const produto = yield Produto_1.default.findByPk(itemId);
                if (produto) {
                    yield ItemCompra_1.default.create({
                        compraId: compraId,
                        tipo: tipo,
                        itemId: itemId,
                        quantidade: quantidade,
                        precoUnitario: produto.preco,
                        subtotal: produto.preco * quantidade,
                    }, { transaction });
                    valorTotal += produto.preco * quantidade;
                }
            }
            else if (tipo === 'servico') {
                const servico = yield Servico_1.default.findByPk(itemId);
                if (servico) {
                    yield ItemCompra_1.default.create({
                        compraId: compraId,
                        tipo: tipo,
                        itemId: itemId,
                        quantidade: quantidade,
                        precoUnitario: servico.preco,
                        subtotal: servico.preco * quantidade,
                    }, { transaction });
                    valorTotal += servico.preco * quantidade;
                }
            }
        }
        return valorTotal;
    });
}
