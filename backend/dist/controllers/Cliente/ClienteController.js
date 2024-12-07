"use strict";
// import { Request, Response } from "express";
// import Cliente from "@models/Cliente";
// import Compra from "@models/Compra";
// import sequelize from "@connections";
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
exports.ClienteController = void 0;
const Cliente_1 = __importDefault(require("@models/Cliente"));
const Compra_1 = __importDefault(require("@models/Compra"));
const _connections_1 = __importDefault(require("@connections"));
exports.ClienteController = {
    getTopClientes: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("ddd");
            const topClientes = yield Compra_1.default.findAll({
                attributes: [
                    "clienteId",
                    [_connections_1.default.fn("SUM", _connections_1.default.col("totalGeral")), "totalConsumido"],
                ],
                include: [
                    {
                        model: Cliente_1.default,
                        as: "cliente",
                        attributes: ["id", "nome"], // Campos que deseja incluir do Cliente
                    },
                ],
                group: ["clienteId", "cliente.id"],
                order: [[_connections_1.default.literal("totalConsumido"), "DESC"]],
                limit: 10,
            });
            if (topClientes.length === 0) {
                res.status(404).json({ message: `Nenhum top cliente encontrado.` });
                return;
            }
            res.status(200).json(topClientes);
        }
        catch (error) {
            console.error("Erro ao buscar os top clientes:", error);
            res.status(500).json({ error: "Erro ao buscar os top clientes." });
        }
    }),
    getClientesByGenero: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { genero } = req.params;
            // Validação do parâmetro
            if (!genero) {
                res.status(400).json({ error: "O parâmetro 'genero' é obrigatório." });
                return;
            }
            // Busca no banco de dados por gênero
            const clientes = yield Cliente_1.default.findAll({
                where: { genero },
                attributes: ["id", "nome", "nomeSocial", "genero"],
            });
            // Verifica se encontrou clientes
            if (clientes.length === 0) {
                res.status(404).json({ message: `Nenhum cliente encontrado para o gênero '${genero}'.` });
                return;
            }
            res.status(200).json(clientes);
        }
        catch (error) {
            console.error("Erro ao buscar clientes por gênero:", error);
            res.status(500).json({ error: "Erro ao buscar clientes por gênero." });
        }
    }),
    findAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const clientes = yield Cliente_1.default.findAll();
            // Ajustar o formato de CPF para resposta
            const clientesFormatados = clientes.map(cliente => ({
                id: cliente.id,
                nome: cliente.nome,
                nomeSocial: cliente.nomeSocial,
                cpfValor: cliente.cpfValor,
                cpfDataEmissao: cliente.cpfDataEmissao,
                genero: cliente.genero,
            }));
            res.status(200).json(clientesFormatados);
        }
        catch (error) {
            console.error("Erro ao listar clientes:", error);
            res.status(500).json({ error: "Erro ao listar clientes." });
        }
    }),
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { nome, nomeSocial, cpf, genero } = req.body;
            // Verificação de campos obrigatórios
            if (!nome || !cpf || !cpf.valor || !cpf.dataEmissao || !genero) {
                res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
                return;
            }
            // Criação do cliente usando as informações do CPF desmembrado
            const cliente = yield Cliente_1.default.create({
                nome,
                nomeSocial,
                cpfValor: cpf.valor,
                cpfDataEmissao: new Date(cpf.dataEmissao),
                genero,
            });
            res.status(201).json(cliente);
        }
        catch (error) {
            console.error("Erro ao criar cliente:", error);
            res.status(500).json({ error: "Erro ao criar cliente." });
        }
    }),
    findOne: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cliente = yield Cliente_1.default.findByPk(id);
            if (!cliente) {
                res.status(404).json({ error: "Cliente não encontrado." });
                return;
            }
            // Ajustar o formato do CPF para resposta
            const clienteFormatado = {
                id: cliente.id,
                nome: cliente.nome,
                nomeSocial: cliente.nomeSocial,
                cpf: {
                    valor: cliente.cpfValor,
                    dataEmissao: cliente.cpfDataEmissao,
                },
                genero: cliente.genero,
            };
            res.status(200).json(clienteFormatado);
        }
        catch (error) {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: "Erro ao buscar cliente." });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params;
            const { nome, nomeSocial, cpf, genero } = req.body;
            const cliente = yield Cliente_1.default.findByPk(id);
            if (!cliente) {
                res.status(404).json({ error: "Cliente não encontrado." });
                return;
            }
            // Atualizar campos se fornecidos
            cliente.nome = nome !== null && nome !== void 0 ? nome : cliente.nome;
            cliente.nomeSocial = nomeSocial !== null && nomeSocial !== void 0 ? nomeSocial : cliente.nomeSocial;
            if (cpf) {
                cliente.cpfValor = (_a = cpf.valor) !== null && _a !== void 0 ? _a : cliente.cpfValor;
                cliente.cpfDataEmissao = cpf.dataEmissao ? new Date(cpf.dataEmissao) : cliente.cpfDataEmissao;
            }
            cliente.genero = genero !== null && genero !== void 0 ? genero : cliente.genero;
            yield cliente.save();
            // Ajustar o formato do CPF para resposta
            const clienteFormatado = {
                id: cliente.id,
                nome: cliente.nome,
                nomeSocial: cliente.nomeSocial,
                cpf: {
                    valor: cliente.cpfValor,
                    dataEmissao: cliente.cpfDataEmissao,
                },
                genero: cliente.genero,
            };
            res.status(200).json(clienteFormatado);
        }
        catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            res.status(500).json({ error: "Erro ao atualizar cliente." });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const cliente = yield Cliente_1.default.findByPk(id);
            if (!cliente) {
                res.status(404).json({ error: "Cliente não encontrado." });
                return;
            }
            yield cliente.destroy();
            res.status(200).json({ message: "Cliente deletado com sucesso." });
        }
        catch (error) {
            console.error("Erro ao deletar cliente:", error);
            res.status(500).json({ error: "Erro ao deletar cliente." });
        }
    })
};
