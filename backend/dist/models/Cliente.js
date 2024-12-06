"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("./Compra")); // Se houver relação com compras, inclua aqui
class Cliente extends sequelize_1.Model {
    // Associações (se houver relação com Compra, por exemplo)
    static associate() {
        Cliente.hasMany(Compra_1.default, { foreignKey: 'clienteId', as: 'compras' });
    }
}
// Inicializando o modelo Cliente
Cliente.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED, // Use UNSIGNED se quiser garantir valores positivos
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nomeSocial: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    cpfValor: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    cpfDataEmissao: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    genero: {
        type: sequelize_1.DataTypes.ENUM("MASCULINO", "FEMININO", "OUTRO", "NAODECLARAR"),
        allowNull: false,
    },
}, {
    sequelize: _connections_1.default,
    modelName: "Cliente",
    tableName: "clientes",
    timestamps: true,
});
exports.default = Cliente;
