"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupAssociations;
const Cliente_1 = __importDefault(require("@models/Cliente"));
const Compra_1 = __importDefault(require("@models/Compra"));
const Produto_1 = __importDefault(require("@models/Produto"));
const Servico_1 = __importDefault(require("@models/Servico"));
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
function setupAssociations() {
    // Cliente - Compra (Um para muitos)
    Cliente_1.default.hasMany(Compra_1.default, {
        foreignKey: 'clienteId',
        as: 'comprasCliente', // Cada cliente pode ter muitas compras
    });
    Compra_1.default.belongsTo(Cliente_1.default, {
        foreignKey: 'clienteId',
        as: 'cliente', // Cada compra pertence a um cliente
    });
    // Compra - ItemCompra (Um para muitos)
    Compra_1.default.hasMany(ItemCompra_1.default, {
        foreignKey: 'compraId',
        as: 'itensDaCompra', // Cada compra pode ter muitos itens (produtos ou serviços)
    });
    ItemCompra_1.default.belongsTo(Compra_1.default, {
        foreignKey: 'compraId',
        as: 'compra', // Cada item de compra pertence a uma compra
    });
    // ItemCompra - Produto e Servico (relacionamento polimórfico)
    ItemCompra_1.default.belongsTo(Produto_1.default, {
        foreignKey: 'itemId',
        as: 'produtoAssociado',
        constraints: false, // Constraints desativadas para evitar restrições de FK, pois 'itemId' pode se referir a produtos ou serviços
    });
    ItemCompra_1.default.belongsTo(Servico_1.default, {
        foreignKey: 'itemId',
        as: 'servicoAssociado',
        constraints: false,
    });
    // Produto - ItemCompra (relacionamento opcional inverso)
    Produto_1.default.hasMany(ItemCompra_1.default, {
        foreignKey: 'itemId',
        as: 'itensComprados',
        constraints: false, // Produto pode estar associado a múltiplos itens de compra
    });
    // Servico - ItemCompra (relacionamento opcional inverso)
    Servico_1.default.hasMany(ItemCompra_1.default, {
        foreignKey: 'itemId',
        as: 'servicosComprados',
        constraints: false, // Serviço pode estar associado a múltiplos itens de compra
    });
}
