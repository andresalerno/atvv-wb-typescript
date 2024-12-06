"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("./Compra"));
const Produto_1 = __importDefault(require("./Produto"));
const Servico_1 = __importDefault(require("./Servico"));
class ItemCompra extends sequelize_1.Model {
    static associate() {
        ItemCompra.belongsTo(Compra_1.default, { foreignKey: 'compraId', as: 'compra' });
        ItemCompra.belongsTo(Produto_1.default, { foreignKey: 'itemId', as: 'produtoAssociado', constraints: false, scope: { tipo: 'produto' } });
        ItemCompra.belongsTo(Servico_1.default, { foreignKey: 'itemId', as: 'servicoAssociado', constraints: false, scope: { tipo: 'servico' } });
    }
}
ItemCompra.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    compraId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Compra_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    },
    tipo: {
        type: sequelize_1.DataTypes.ENUM('produto', 'servico'),
        allowNull: false,
    },
    itemId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
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
    precoUnitario: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: _connections_1.default,
    modelName: 'ItemCompra',
    tableName: 'itensCompra',
    timestamps: false,
});
exports.default = ItemCompra;
