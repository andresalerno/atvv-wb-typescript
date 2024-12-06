import { Request, Response } from 'express';
import Produto from '@models/Produto';
import ItemCompra from '@models/ItemCompra';
import sequelize from '@connections';
import Compra from '@models/Compra';
import Cliente from '@models/Cliente';

class ProdutoController {
  
  public async getProdutosMaisConsumidosPorGenero(req: Request, res: Response): Promise<void> {
    try {
        const produtosPorGenero = await ItemCompra.findAll({
            attributes: [
                [sequelize.col("cliente.genero"), "genero"], // Gênero do cliente
                "itemId", // ID do produto
                [sequelize.fn("SUM", sequelize.col("quantidade")), "totalConsumido"], // Soma das quantidades consumidas
            ],
            include: [
                {
                    model: Compra,
                    as: "compra", // Relacionamento ItemCompra -> Compra
                    include: [
                        {
                            model: Cliente,
                            as: "cliente", // Relacionamento Compra -> Cliente
                            attributes: ["genero"], // Gênero do cliente
                        },
                    ],
                },
                {
                    model: Produto,
                    as: "produtoAssociado", // Relacionamento ItemCompra -> Produto
                    attributes: ["id", "nome", "preco"], // Detalhes do produto
                },
            ],
            group: ["cliente.genero", "itemId", "produtoAssociado.id"], // Agrupa por gênero e produto
            order: [[sequelize.literal("totalConsumido"), "DESC"]], // Ordena pelo total consumido em ordem decrescente
        });

        res.status(200).json(produtosPorGenero);
    } catch (error) {
        console.error("Erro ao buscar os produtos mais consumidos por gênero:", error);
        res.status(500).json({ error: "Erro ao buscar os produtos mais consumidos por gênero." });
    }
}


  public async getProdutosMaisConsumidos(req: Request, res: Response): Promise<void> {
    try {
        const produtosMaisConsumidos = await ItemCompra.findAll({
            attributes: [
                "itemId", // ID do produto
                [sequelize.fn("SUM", sequelize.col("quantidade")), "totalConsumido"], // Soma as quantidades consumidas
            ],
            include: [
                {
                    model: Produto,
                    as: "produtoAssociado", // Alias usado no relacionamento ItemCompra -> Produto
                    attributes: ["id", "nome", "preco"], // Inclui detalhes do produto
                },
            ],
            group: ["itemId", "produtoAssociado.id"], // Agrupa por produto
            order: [[sequelize.literal("totalConsumido"), "DESC"]], // Ordena em ordem decrescente
            limit: 10, // Opcional: limite de 10 produtos
        });

        res.status(200).json(produtosMaisConsumidos);
    } catch (error) {
        console.error("Erro ao buscar os produtos mais consumidos:", error);
        res.status(500).json({ error: "Erro ao buscar os produtos mais consumidos." });
    }
}


  public async create(req: Request, res: Response): Promise<void> {
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
      const produto = await Produto.create({ nome, preco: precoNumerico });
      res.status(201).json(produto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro ao criar produto.' });
    }
  }

  // Listar todos os produtos
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const produtos = await Produto.findAll();
      res.status(200).json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos.' });
    }
  }

  // Buscar um único produto por ID
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        res.status(404).json({ error: 'Produto não encontrado.' });
        return;
      }

      res.status(200).json(produto);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
  }

  // Atualizar um produto por ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, preco } = req.body;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        res.status(404).json({ error: 'Produto não encontrado.' });
        return;
      }

      // Atualizar os campos fornecidos
      produto.nome = nome ?? produto.nome;
      if (preco !== undefined) {
        const precoNumerico = parseFloat(preco);
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
          res.status(400).json({ error: 'O preço deve ser um número maior que zero.' });
          return;
        }
        produto.preco = precoNumerico;
      }

      await produto.save();
      res.status(200).json(produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
  }

  // Excluir um produto por ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const produto = await Produto.findByPk(id);
      if (!produto) {
        res.status(404).json({ error: 'Produto não encontrado.' });
        return;
      }

      await produto.destroy();
      res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
  }
}

export default new ProdutoController();
