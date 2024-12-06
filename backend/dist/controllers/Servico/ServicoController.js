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
class ServicoController {
    // Criar um novo serviço
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
