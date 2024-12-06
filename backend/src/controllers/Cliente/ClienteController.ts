import { Request, Response } from "express";
import Cliente from "@models/Cliente";

class ClienteController {
    public async create(req: Request, res: Response): Promise<void> {
        try {
            const { nome, nomeSocial, cpf, genero } = req.body;

            // Verificação de campos obrigatórios
            if (!nome || !cpf || !cpf.valor || !cpf.dataEmissao || !genero) {
                res.status(400).json({ error: "Campos obrigatórios não preenchidos." });
                return;
            }

            // Criação do cliente usando as informações do CPF desmembrado
            const cliente = await Cliente.create({
                nome,
                nomeSocial,
                cpfValor: cpf.valor,
                cpfDataEmissao: new Date(cpf.dataEmissao),
                genero,
            });

            res.status(201).json(cliente);
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            res.status(500).json({ error: "Erro ao criar cliente." });
        }
    }

    public async findAll(req: Request, res: Response): Promise<void> {
        try {
            const clientes = await Cliente.findAll();
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
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            res.status(500).json({ error: "Erro ao listar clientes." });
        }
    }

    public async findOne(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const cliente = await Cliente.findByPk(id);
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
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
            res.status(500).json({ error: "Erro ao buscar cliente." });
        }
    }

    public async update(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { nome, nomeSocial, cpf, genero } = req.body;

            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                res.status(404).json({ error: "Cliente não encontrado." });
                return;
            }

            // Atualizar campos se fornecidos
            cliente.nome = nome ?? cliente.nome;
            cliente.nomeSocial = nomeSocial ?? cliente.nomeSocial;

            if (cpf) {
                cliente.cpfValor = cpf.valor ?? cliente.cpfValor;
                cliente.cpfDataEmissao = cpf.dataEmissao ? new Date(cpf.dataEmissao) : cliente.cpfDataEmissao;
            }

            cliente.genero = genero ?? cliente.genero;

            await cliente.save();

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
        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            res.status(500).json({ error: "Erro ao atualizar cliente." });
        }
    }

    public async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const cliente = await Cliente.findByPk(id);
            if (!cliente) {
                res.status(404).json({ error: "Cliente não encontrado." });
                return;
            }

            await cliente.destroy();

            res.status(200).json({ message: "Cliente deletado com sucesso." });
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            res.status(500).json({ error: "Erro ao deletar cliente." });
        }
    }
}

export default new ClienteController();
