import { Request, Response } from "express";
import Cliente from "@models/Cliente";
import Compra from "@models/Compra";
import sequelize from "@connections";

class ClienteController {
    
    public async getTop5Clientes(req: Request, res: Response) {
        try {
            const top5Clientes = await Compra.findAll({
                attributes: [
                    "clienteId",
                    [sequelize.fn("SUM", sequelize.col("totalGeral")), "totalConsumido"],
                ],
                include: [
                    {
                        model: Cliente,
                        as: "cliente",
                        attributes: ["id", "nome"], // Campos desejados do Cliente
                    },
                ],
                group: ["clienteId", "cliente.id"],
                order: [[sequelize.literal("totalConsumido"), "DESC"]], // Ordena em ordem decrescente
                limit: 5, // Limita a 5 clientes
            });
    
            res.status(200).json(top5Clientes);
        } catch (error) {
            console.error("Erro ao buscar os 5 clientes que mais consumiram:", error);
            res.status(500).json({ error: "Erro ao buscar os 5 clientes que mais consumiram." });
        }
    }
    

    public async getBottom10Clientes(req: Request, res: Response): Promise<void> {
        try {
            const bottomClientes = await Compra.findAll({
                attributes: [
                    "clienteId",
                    [sequelize.fn("SUM", sequelize.col("totalGeral")), "totalConsumido"],
                ],
                include: [
                    {
                        model: Cliente,
                        as: "cliente", // Alias definido na associação Compra.belongsTo(Cliente)
                        attributes: ["id", "nome"], // Campos desejados do Cliente
                    },
                ],
                group: ["clienteId", "cliente.id"],
                order: [[sequelize.literal("totalConsumido"), "ASC"]], // Ordena em ordem crescente
                limit: 10,
            });
    
            res.status(200).json(bottomClientes);
        } catch (error) {
            console.error("Erro ao buscar os 10 clientes que menos consumiram:", error);
            res.status(500).json({ error: "Erro ao buscar os 10 clientes que menos consumiram." });
        }
    }
    


    public async getClientesByGenero(req: Request, res: Response): Promise<void> {
        try {
            const { genero } = req.params;
    
            // Validação do parâmetro
            if (!genero) {
                res.status(400).json({ error: "O parâmetro 'genero' é obrigatório." });
                return;
            }
    
            // Busca no banco de dados por gênero
            const clientes = await Cliente.findAll({
                where: { genero },
                attributes: ["id", "nome", "nomeSocial", "genero"],
            });
    
            // Verifica se encontrou clientes
            if (clientes.length === 0) {
                res.status(404).json({ message: `Nenhum cliente encontrado para o gênero '${genero}'.` });
                return;
            }
    
            res.status(200).json(clientes);
        } catch (error) {
            console.error("Erro ao buscar clientes por gênero:", error);
            res.status(500).json({ error: "Erro ao buscar clientes por gênero." });
        }
    }
    
    
    public async getClientesGroupedByGenero(req: Request, res: Response): Promise<void> {
        try {
            const clientesPorGenero = await Cliente.findAll({
                attributes: [
                    "genero",
                    [sequelize.fn("COUNT", sequelize.col("id")), "totalClientes"],
                ],
                group: ["genero"],
                order: [[sequelize.literal("totalClientes"), "DESC"]], // Ordena pelo total de clientes
            });
    
            res.status(200).json(clientesPorGenero);
        } catch (error) {
            console.error("Erro ao agrupar clientes por gênero:", error);
            res.status(500).json({ error: "Erro ao agrupar clientes por gênero." });
        }
    }
    
    
    
    public async getTopClientes(req: Request, res: Response): Promise<void> {
        try {
            const topClientes = await Compra.findAll({
                attributes: [
                    "clienteId",
                    [sequelize.fn("SUM", sequelize.col("totalGeral")), "totalConsumido"],
                ],
                include: [
                    {
                        model: Cliente,
                        as: "cliente", // Alias deve corresponder ao definido no belongsTo
                        attributes: ["id", "nome"], // Campos que deseja incluir do Cliente
                    },
                ],
                group: ["clienteId", "cliente.id"],
                order: [[sequelize.literal("totalConsumido"), "DESC"]],
                limit: 10,
            });
    
            res.status(200).json(topClientes);
        } catch (error) {
            console.error("Erro ao buscar os top clientes:", error);
            res.status(500).json({ error: "Erro ao buscar os top clientes." });
        }
    }
    
    
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
