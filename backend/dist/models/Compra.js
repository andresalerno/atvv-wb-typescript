"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _connections_1 = __importDefault(require("@connections"));
const Cliente_1 = __importDefault(require("./Cliente"));
const ItemCompra_1 = __importDefault(require("./ItemCompra"));
class Compra extends sequelize_1.Model {
    static associate() {
        Compra.belongsTo(Cliente_1.default, { foreignKey: 'clienteId', as: 'cliente' });
        Compra.hasMany(ItemCompra_1.default, { foreignKey: 'compraId', as: 'itensDaCompra' });
    }
}
Compra.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    clienteId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Cliente_1.default,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    dataEvento: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    totalGeral: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: _connections_1.default,
    modelName: 'Compra',
    tableName: 'compras',
    timestamps: true,
});
exports.default = Compra;
