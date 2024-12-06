"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _connections_1 = __importDefault(require("@connections"));
class Produto extends sequelize_1.Model {
}
// Inicialização do modelo com o Sequelize
Produto.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O nome do produto é obrigatório.',
            },
        },
    },
    preco: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: {
                msg: 'O preço deve ser um número válido.',
            },
            min: {
                args: [0.01],
                msg: 'O preço deve ser maior que zero.',
            },
        },
    },
}, {
    sequelize: _connections_1.default,
    modelName: 'Produto',
    tableName: 'produtos',
    timestamps: true,
});
exports.default = Produto;
