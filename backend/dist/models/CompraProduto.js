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
const sequelize_1 = require("sequelize");
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("@models/Compra"));
const Produto_1 = __importDefault(require("@models/Produto"));
class CompraProduto extends sequelize_1.Model {
    // Associações
    static associate() {
        CompraProduto.belongsTo(Compra_1.default, { foreignKey: 'compraId', as: 'compra' });
        CompraProduto.belongsTo(Produto_1.default, { foreignKey: 'produtoId', as: 'produto' });
    }
}
// Inicializando o modelo
CompraProduto.init({
    compraId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Compra_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    produtoId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Produto_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    quantidade: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    subtotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: _connections_1.default,
    modelName: 'CompraProduto',
    tableName: 'compra_produto',
    timestamps: false,
});
// Hooks para calcular o subtotal automaticamente
CompraProduto.beforeCreate((compraProduto, options) => __awaiter(void 0, void 0, void 0, function* () {
    const produto = yield Produto_1.default.findByPk(compraProduto.produtoId);
    if (produto) {
        compraProduto.subtotal = produto.preco * compraProduto.quantidade;
    }
}));
CompraProduto.beforeUpdate((compraProduto, options) => __awaiter(void 0, void 0, void 0, function* () {
    const produto = yield Produto_1.default.findByPk(compraProduto.produtoId);
    if (produto) {
        compraProduto.subtotal = produto.preco * compraProduto.quantidade;
    }
}));
// Relacionamentos
Compra_1.default.hasMany(CompraProduto, { foreignKey: 'compraId', as: 'itensCompra' });
Produto_1.default.hasMany(CompraProduto, { foreignKey: 'produtoId', as: 'comprasAssociadas' });
CompraProduto.belongsTo(Compra_1.default, { foreignKey: 'compraId', as: 'compra' });
CompraProduto.belongsTo(Produto_1.default, { foreignKey: 'produtoId', as: 'produto' });
exports.default = CompraProduto;
