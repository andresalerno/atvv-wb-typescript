import { Request, Response } from 'express';
import Produto from '@models/Produto';

class ProdutoController {
  // Criar um novo produto
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
