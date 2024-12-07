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
const Servico_1 = __importDefault(require("@models/Servico"));
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
const _connections_1 = __importDefault(require("@connections"));
const Compra_1 = __importDefault(require("@models/Compra"));
const Cliente_1 = __importDefault(require("@models/Cliente"));
class ServicoController {
    getServicosMaisConsumidosPorGenero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicosPorGenero = yield ItemCompra_1.default.findAll({
                    attributes: [
                        [_connections_1.default.col("cliente.genero"), "genero"], // Gênero do cliente
                        "itemId", // ID do serviço
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
                            model: Servico_1.default,
                            as: "servicoAssociado", // Relacionamento ItemCompra -> Servico
                            attributes: ["id", "nome", "preco"], // Detalhes do serviço
                        },
                    ],
                    group: ["cliente.genero", "itemId", "servicoAssociado.id"], // Agrupa por gênero e serviço
                    order: [[_connections_1.default.literal("totalConsumido"), "DESC"]], // Ordena pelo total consumido em ordem decrescente
                });
                res.status(200).json(servicosPorGenero);
            }
            catch (error) {
                console.error("Erro ao buscar os serviços mais consumidos por gênero:", error);
                res.status(500).json({ error: "Erro ao buscar os serviços mais consumidos por gênero." });
            }
        });
    }
    getServicosMaisConsumidos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicosMaisConsumidos = yield ItemCompra_1.default.findAll({
                    attributes: [
                        "itemId", // ID do serviço
                        [_connections_1.default.fn("SUM", _connections_1.default.col("quantidade")), "totalConsumido"], // Soma as quantidades consumidas
                    ],
                    include: [
                        {
                            model: Servico_1.default,
                            as: "servicoAssociado", // Alias usado no relacionamento ItemCompra -> Servico
                            attributes: ["id", "nome", "preco"], // Inclui detalhes do serviço
                        },
                    ],
                    group: ["itemId", "servicoAssociado.id"], // Agrupa por serviço
                    order: [[_connections_1.default.literal("totalConsumido"), "DESC"]], // Ordena em ordem decrescente
                    limit: 10, // Opcional: limite de 10 serviços
                });
                res.status(200).json(servicosMaisConsumidos);
            }
            catch (error) {
                console.error("Erro ao buscar os serviços mais consumidos:", error);
                res.status(500).json({ error: "Erro ao buscar os serviços mais consumidos." });
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
                // Criação do serviço
                const servico = yield Servico_1.default.create({ nome, preco: precoNumerico });
                res.status(201).json(servico);
            }
            catch (error) {
                console.error('Erro ao criar serviço:', error);
                res.status(500).json({ error: 'Erro ao criar serviço.' });
            }
        });
    }
    // Listar todos os serviços
    findAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const servicos = yield Servico_1.default.findAll();
                res.status(200).json(servicos);
            }
            catch (error) {
                console.error('Erro ao listar serviços:', error);
                res.status(500).json({ error: 'Erro ao listar serviços.' });
            }
        });
    }
    // Buscar um serviço por ID
    findOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const servico = yield Servico_1.default.findByPk(id);
                if (!servico) {
                    res.status(404).json({ error: 'Serviço não encontrado.' });
                    return;
                }
                res.status(200).json(servico);
            }
            catch (error) {
                console.error('Erro ao buscar serviço:', error);
                res.status(500).json({ error: 'Erro ao buscar serviço.' });
            }
        });
    }
    // Atualizar um serviço por ID
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, preco } = req.body;
                const servico = yield Servico_1.default.findByPk(id);
                if (!servico) {
                    res.status(404).json({ error: 'Serviço não encontrado.' });
                    return;
                }
                // Atualizar os campos fornecidos
                servico.nome = nome !== null && nome !== void 0 ? nome : servico.nome;
                if (preco !== undefined) {
                    const precoNumerico = parseFloat(preco);
                    if (isNaN(precoNumerico) || precoNumerico <= 0) {
                        res.status(400).json({ error: 'O preço deve ser um número maior que zero.' });
                        return;
                    }
                    servico.preco = precoNumerico;
                }
                yield servico.save();
                res.status(200).json(servico);
            }
            catch (error) {
                console.error('Erro ao atualizar serviço:', error);
                res.status(500).json({ error: 'Erro ao atualizar serviço.' });
            }
        });
    }
    // Excluir um serviço por ID
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const servico = yield Servico_1.default.findByPk(id);
                if (!servico) {
                    res.status(404).json({ error: 'Serviço não encontrado.' });
                    return;
                }
                yield servico.destroy();
                res.status(200).json({ message: 'Serviço deletado com sucesso.' });
            }
            catch (error) {
                console.error('Erro ao deletar serviço:', error);
                res.status(500).json({ error: 'Erro ao deletar serviço.' });
            }
        });
    }
}
exports.default = new ServicoController();
