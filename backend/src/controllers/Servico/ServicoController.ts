import { Request, Response } from 'express';
import Servico from '@models/Servico';

class ServicoController {
  // Criar um novo serviço
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

      // Criação do serviço
      const servico = await Servico.create({ nome, preco: precoNumerico });
      res.status(201).json(servico);
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      res.status(500).json({ error: 'Erro ao criar serviço.' });
    }
  }

  // Listar todos os serviços
  public async findAll(req: Request, res: Response): Promise<void> {
    try {
      const servicos = await Servico.findAll();
      res.status(200).json(servicos);
    } catch (error) {
      console.error('Erro ao listar serviços:', error);
      res.status(500).json({ error: 'Erro ao listar serviços.' });
    }
  }

  // Buscar um serviço por ID
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const servico = await Servico.findByPk(id);
      if (!servico) {
        res.status(404).json({ error: 'Serviço não encontrado.' });
        return;
      }

      res.status(200).json(servico);
    } catch (error) {
      console.error('Erro ao buscar serviço:', error);
      res.status(500).json({ error: 'Erro ao buscar serviço.' });
    }
  }

  // Atualizar um serviço por ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { nome, preco } = req.body;

      const servico = await Servico.findByPk(id);
      if (!servico) {
        res.status(404).json({ error: 'Serviço não encontrado.' });
        return;
      }

      // Atualizar os campos fornecidos
      servico.nome = nome ?? servico.nome;
      if (preco !== undefined) {
        const precoNumerico = parseFloat(preco);
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
          res.status(400).json({ error: 'O preço deve ser um número maior que zero.' });
          return;
        }
        servico.preco = precoNumerico;
      }

      await servico.save();
      res.status(200).json(servico);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      res.status(500).json({ error: 'Erro ao atualizar serviço.' });
    }
  }

  // Excluir um serviço por ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const servico = await Servico.findByPk(id);
      if (!servico) {
        res.status(404).json({ error: 'Serviço não encontrado.' });
        return;
      }

      await servico.destroy();
      res.status(200).json({ message: 'Serviço deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      res.status(500).json({ error: 'Erro ao deletar serviço.' });
    }
  }
}

export default new ServicoController();
