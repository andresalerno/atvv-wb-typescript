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
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("@models/Compra"));
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
const Cliente_1 = __importDefault(require("@models/Cliente"));
const Produto_1 = __importDefault(require("@models/Produto"));
const Servico_1 = __importDefault(require("@models/Servico"));
class CompraController {
    // Função auxiliar para adicionar itens e calcular o valor total
    addItensCompra(itensCompra, compraId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let valorTotal = 0;
            for (const item of itensCompra) {
                const { tipo, itemId, quantidade } = item;
                if (tipo === 'produto') {
                    const produto = yield Produto_1.default.findByPk(itemId);
                    if (produto) {
                        yield ItemCompra_1.default.create({
                            compraId,
                            tipo,
                            itemId,
                            quantidade,
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
                            compraId,
                            tipo,
                            itemId,
                            quantidade,
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
    // Criar uma nova compra
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield _connections_1.default.transaction();
            try {
                const { clienteId, itensCompra } = req.body;
                if (!clienteId || !itensCompra || itensCompra.length === 0) {
                    res.status(400).json({ error: 'Cliente e itens da compra são obrigatórios.' });
                    return;
                }
                // Criar a compra
                const compra = yield Compra_1.default.create({ clienteId, dataEvento: new Date(), totalGeral: 0 }, { transaction });
                // Adicionar itens da compra e calcular valor total
                const valorTotal = yield this.addItensCompra(itensCompra, compra.id, transaction);
                // Atualizar valor total da compra
                compra.totalGeral = valorTotal;
                yield compra.save({ transaction });
                yield transaction.commit();
                res.status(201).json(compra);
            }
            catch (error) {
                console.error('Erro ao criar compra:', error);
                yield transaction.rollback();
                res.status(500).json({ error: 'Erro ao criar compra.' });
            }
        });
    }
    // Atualizar uma compra por ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield _connections_1.default.transaction();
            try {
                const { id } = req.params;
                const { itensCompra } = req.body;
                if (!itensCompra || itensCompra.length === 0) {
                    res.status(400).json({ error: 'Itens da compra são obrigatórios.' });
                    return;
                }
                const compra = yield Compra_1.default.findByPk(id);
                if (!compra) {
                    res.status(404).json({ error: 'Compra não encontrada.' });
                    return;
                }
                // Deletar os itens atuais da compra
                yield ItemCompra_1.default.destroy({ where: { compraId: compra.id }, transaction });
                // Adicionar novos itens e calcular valor total
                const valorTotal = yield this.addItensCompra(itensCompra, compra.id, transaction);
                // Atualizar valor total da compra
                compra.totalGeral = valorTotal;
                yield compra.save({ transaction });
                yield transaction.commit();
                res.status(200).json(compra);
            }
            catch (error) {
                console.error('Erro ao atualizar compra:', error);
                yield transaction.rollback();
                res.status(500).json({ error: 'Erro ao atualizar compra.' });
            }
        });
    }
    // CompraController.ts (parcial)
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const compras = yield Compra_1.default.findAll({
                    include: [
                        { model: Cliente_1.default, as: 'cliente', attributes: ['nome'] },
                        {
                            model: ItemCompra_1.default,
                            as: 'itensDaCompra',
                            include: [
                                { model: Produto_1.default, as: 'produtoAssociado', attributes: ['nome', 'preco'], required: false },
                                { model: Servico_1.default, as: 'servicoAssociado', attributes: ['nome', 'preco'], required: false },
                            ],
                        },
                    ],
                });
                res.status(200).json(compras);
            }
            catch (error) {
                console.error('Erro ao listar compras:', error);
                res.status(500).json({ error: 'Erro ao listar compras.' });
            }
        });
    }
    // Buscar uma compra por ID
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const compra = yield Compra_1.default.findByPk(id, {
                    include: [
                        { model: Cliente_1.default, as: 'cliente', attributes: ['nome'] },
                        {
                            model: ItemCompra_1.default,
                            as: 'itensDaCompra',
                            include: [
                                { model: Produto_1.default, as: 'produto', attributes: ['nome', 'preco'] },
                                { model: Servico_1.default, as: 'servico', attributes: ['nome', 'preco'] },
                            ],
                        },
                    ],
                });
                if (!compra) {
                    res.status(404).json({ error: 'Compra não encontrada.' });
                    return;
                }
                res.status(200).json(compra);
            }
            catch (error) {
                console.error('Erro ao buscar compra:', error);
                res.status(500).json({ error: 'Erro ao buscar compra.' });
            }
        });
    }
    // Deletar uma compra por ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield _connections_1.default.transaction();
            try {
                const { id } = req.params;
                const compra = yield Compra_1.default.findByPk(id);
                if (!compra) {
                    res.status(404).json({ error: 'Compra não encontrada.' });
                    return;
                }
                yield ItemCompra_1.default.destroy({ where: { compraId: compra.id }, transaction });
                yield compra.destroy({ transaction });
                yield transaction.commit();
                res.status(200).json({ message: 'Compra deletada com sucesso.' });
            }
            catch (error) {
                console.error('Erro ao deletar compra:', error);
                yield transaction.rollback();
                res.status(500).json({ error: 'Erro ao deletar compra.' });
            }
        });
    }
}
exports.default = new CompraController();
