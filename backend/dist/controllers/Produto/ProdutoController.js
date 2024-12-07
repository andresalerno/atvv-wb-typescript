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
const Produto_1 = __importDefault(require("@models/Produto"));
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("@models/Compra"));
const Cliente_1 = __importDefault(require("@models/Cliente"));
class ProdutoController {
    getProdutosMaisConsumidosPorGenero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const produtosPorGenero = yield ItemCompra_1.default.findAll({
                    attributes: [
                        [_connections_1.default.col("cliente.genero"), "genero"], // Gênero do cliente
                        "itemId", // ID do produto
                        [_connections_1.default.fn("SUM", _connections_1.default.col("quantidade")), "totalConsumido"], // Soma das quantidades consumidas
                    ],
                    include: [
                        {
                            model: Compra_1.default,
                            as: "compra", // Relacionamento ItemCompra -> Compra
                            include: [
                                {
                                    model: Cliente_1.default,
                                    as: "cliente", // Relacionamento Compra -> Cliente
                                    attributes: ["genero"], // Gênero do cliente
                                },
                            ],
                        },
                        {
                            model: Produto_1.default,
                            as: "produtoAssociado", // Relacionamento ItemCompra -> Produto
                            attributes: ["id", "nome", "preco"], // Detalhes do produto
                        },
                    ],
                    group: ["cliente.genero", "itemId", "produtoAssociado.id"], // Agrupa por gênero e produto
                    order: [[_connections_1.default.literal("totalConsumido"), "DESC"]], // Ordena pelo total consumido em ordem decrescente
                });
                res.status(200).json(produtosPorGenero);
            }
            catch (error) {
                console.error("Erro ao buscar os produtos mais consumidos por gênero:", error);
                res.status(500).json({ error: "Erro ao buscar os produtos mais consumidos por gênero." });
            }
        });
    }
    getProdutosMaisConsumidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const produtosMaisConsumidos = yield ItemCompra_1.default.findAll({
                    attributes: [
                        "itemId", // ID do produto
                        [_connections_1.default.fn("SUM", _connections_1.default.col("quantidade")), "totalConsumido"], // Soma as quantidades consumidas
                    ],
                    include: [
                        {
                            model: Produto_1.default,
                            as: "produtoAssociado", // Alias usado no relacionamento ItemCompra -> Produto
                            attributes: ["id", "nome", "preco"], // Inclui detalhes do produto
                        },
                    ],
                    group: ["itemId", "produtoAssociado.id"], // Agrupa por produto
                    order: [[_connections_1.default.literal("totalConsumido"), "DESC"]], // Ordena em ordem decrescente
                    limit: 10, // Opcional: limite de 10 produtos
                });
                res.status(200).json(produtosMaisConsumidos);
            }
            catch (error) {
                console.error("Erro ao buscar os produtos mais consumidos:", error);
                res.status(500).json({ error: "Erro ao buscar os produtos mais consumidos." });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, preco } = req.body;
                // Validação básica dos campos
                if (!nome || !preco) {
                    res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
                    return;
                }
                const precoNumerico = parseFloat(preco);
                if (isNaN(precoNumerico) || precoNumerico <= 0) {
                    res.status(400).json({ error: 'O preço deve ser um número maior que zero.' });
                    return;
                }
                // Criação do produto
                const produto = yield Produto_1.default.create({ nome, preco: precoNumerico });
                res.status(201).json(produto);
            }
            catch (error) {
                console.error('Erro ao criar produto:', error);
                res.status(500).json({ error: 'Erro ao criar produto.' });
            }
        });
    }
    // Listar todos os produtos
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const produtos = yield Produto_1.default.findAll();
                res.status(200).json(produtos);
            }
            catch (error) {
                console.error('Erro ao listar produtos:', error);
                res.status(500).json({ error: 'Erro ao listar produtos.' });
            }
        });
    }
    // Buscar um único produto por ID
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const produto = yield Produto_1.default.findByPk(id);
                if (!produto) {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                    return;
                }
                res.status(200).json(produto);
            }
            catch (error) {
                console.error('Erro ao buscar produto:', error);
                res.status(500).json({ error: 'Erro ao buscar produto.' });
            }
        });
    }
    // Atualizar um produto por ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, preco } = req.body;
                const produto = yield Produto_1.default.findByPk(id);
                if (!produto) {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                    return;
                }
                // Atualizar os campos fornecidos
                produto.nome = nome !== null && nome !== void 0 ? nome : produto.nome;
                if (preco !== undefined) {
                    const precoNumerico = parseFloat(preco);
                    if (isNaN(precoNumerico) || precoNumerico <= 0) {
                        res.status(400).json({ error: 'O preço deve ser um número maior que zero.' });
                        return;
                    }
                    produto.preco = precoNumerico;
                }
                yield produto.save();
                res.status(200).json(produto);
            }
            catch (error) {
                console.error('Erro ao atualizar produto:', error);
                res.status(500).json({ error: 'Erro ao atualizar produto.' });
            }
        });
    }
    // Excluir um produto por ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const produto = yield Produto_1.default.findByPk(id);
                if (!produto) {
                    res.status(404).json({ error: 'Produto não encontrado.' });
                    return;
                }
                yield produto.destroy();
                res.status(200).json({ message: 'Produto deletado com sucesso.' });
            }
            catch (error) {
                console.error('Erro ao deletar produto:', error);
                res.status(500).json({ error: 'Erro ao deletar produto.' });
            }
        });
    }
}
exports.default = new ProdutoController();
