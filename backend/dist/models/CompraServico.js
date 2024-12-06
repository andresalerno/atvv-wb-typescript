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
const Servico_1 = __importDefault(require("@models/Servico"));
class CompraServico extends sequelize_1.Model {
    // Associações
    static associate() {
        CompraServico.belongsTo(Compra_1.default, { foreignKey: 'compraId', as: 'compra' });
        CompraServico.belongsTo(Servico_1.default, { foreignKey: 'servicoId', as: 'servico' });
    }
}
// Inicializando o modelo
CompraServico.init({
    compraId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Compra_1.default,
            key: 'id',
        },
        onDelete: 'CASCADE',
        allowNull: false,
    },
    servicoId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Servico_1.default,
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
    modelName: 'CompraServico',
    tableName: 'compra_servico',
    timestamps: false,
});
// Hooks para calcular o subtotal automaticamente
CompraServico.beforeCreate((compraServico, options) => __awaiter(void 0, void 0, void 0, function* () {
    const servico = yield Servico_1.default.findByPk(compraServico.servicoId);
    if (servico) {
        compraServico.subtotal = servico.preco * compraServico.quantidade;
    }
}));
CompraServico.beforeUpdate((compraServico, options) => __awaiter(void 0, void 0, void 0, function* () {
    const servico = yield Servico_1.default.findByPk(compraServico.servicoId);
    if (servico) {
        compraServico.subtotal = servico.preco * compraServico.quantidade;
    }
}));
// Relacionamentos
Compra_1.default.hasMany(CompraServico, { foreignKey: 'compraId', as: 'itensServico' });
Servico_1.default.hasMany(CompraServico, { foreignKey: 'servicoId', as: 'comprasAssociadas' });
CompraServico.belongsTo(Compra_1.default, { foreignKey: 'compraId', as: 'compra' });
CompraServico.belongsTo(Servico_1.default, { foreignKey: 'servicoId', as: 'servico' });
exports.default = CompraServico;
