import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import sequelize from '@connections';
import Compra from '@models/Compra';
import ItemCompra from '@models/ItemCompra';
import Cliente from '@models/Cliente';
import Produto from '@models/Produto';
import Servico from '@models/Servico';

class CompraController {
  // Função auxiliar para adicionar itens e calcular o valor total
  private async addItensCompra(itensCompra: any[], compraId: number, transaction: Transaction): Promise<number> {
    let valorTotal = 0;

    for (const item of itensCompra) {
      const { tipo, itemId, quantidade } = item;

      if (tipo === 'produto') {
        const produto = await Produto.findByPk(itemId);
        if (produto) {
          await ItemCompra.create({
            compraId,
            tipo,
            itemId,
            quantidade,
            precoUnitario: produto.preco,
            subtotal: produto.preco * quantidade,
          }, { transaction });
          valorTotal += produto.preco * quantidade;
        }
      } else if (tipo === 'servico') {
        const servico = await Servico.findByPk(itemId);
        if (servico) {
          await ItemCompra.create({
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
  }

  // Criar uma nova compra
  public async create(req: Request, res: Response): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { clienteId, itensCompra } = req.body;

      if (!clienteId || !itensCompra || itensCompra.length === 0) {
        res.status(400).json({ error: 'Cliente e itens da compra são obrigatórios.' });
        return;
      }

      // Criar a compra
      const compra = await Compra.create({ clienteId, dataEvento: new Date(), totalGeral: 0 }, { transaction });

      // Adicionar itens da compra e calcular valor total
      const valorTotal = await this.addItensCompra(itensCompra, compra.id, transaction);

      // Atualizar valor total da compra
      compra.totalGeral = valorTotal;
      await compra.save({ transaction });

      await transaction.commit();
      res.status(201).json(compra);
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      await transaction.rollback();
      res.status(500).json({ error: 'Erro ao criar compra.' });
    }
  }

  // Atualizar uma compra por ID
  public async update(req: Request, res: Response): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { itensCompra } = req.body;

      if (!itensCompra || itensCompra.length === 0) {
        res.status(400).json({ error: 'Itens da compra são obrigatórios.' });
        return;
      }

      const compra = await Compra.findByPk(id);
      if (!compra) {
        res.status(404).json({ error: 'Compra não encontrada.' });
        return;
      }

      // Deletar os itens atuais da compra
      await ItemCompra.destroy({ where: { compraId: compra.id }, transaction });

      // Adicionar novos itens e calcular valor total
      const valorTotal = await this.addItensCompra(itensCompra, compra.id, transaction);

      // Atualizar valor total da compra
      compra.totalGeral = valorTotal;
      await compra.save({ transaction });

      await transaction.commit();
      res.status(200).json(compra);
    } catch (error) {
      console.error('Erro ao atualizar compra:', error);
      await transaction.rollback();
      res.status(500).json({ error: 'Erro ao atualizar compra.' });
    }
  }

// CompraController.ts (parcial)
public async findAll(req: Request, res: Response): Promise<void> {
  try {
    const compras = await Compra.findAll({
      include: [
        { model: Cliente, as: 'cliente', attributes: ['id', 'nome'] },
        {
          model: ItemCompra,
          as: 'itensDaCompra',
          include: [
            { model: Produto, as: 'produtoAssociado', attributes: ['id', 'nome', 'preco'], required: false },
            { model: Servico, as: 'servicoAssociado', attributes: ['id', 'nome', 'preco'], required: false },
          ],
        },
      ],
    });
    res.status(200).json(compras);
  } catch (error) {
    console.error('Erro ao listar compras:', error);
    res.status(500).json({ error: 'Erro ao listar compras.' });
  }
}



  // Buscar uma compra por ID
  public async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const compra = await Compra.findByPk(id, {
        include: [
          { model: Cliente, as: 'cliente', attributes: ['nome'] },
          {
            model: ItemCompra,
            as: 'itensDaCompra',
            include: [
              { model: Produto, as: 'produto', attributes: ['nome', 'preco'] },
              { model: Servico, as: 'servico', attributes: ['nome', 'preco'] },
            ],
          },
        ],
      });

      if (!compra) {
        res.status(404).json({ error: 'Compra não encontrada.' });
        return;
      }

      res.status(200).json(compra);
    } catch (error) {
      console.error('Erro ao buscar compra:', error);
      res.status(500).json({ error: 'Erro ao buscar compra.' });
    }
  }

  // Deletar uma compra por ID
  public async delete(req: Request, res: Response): Promise<void> {
    const transaction: Transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      const compra = await Compra.findByPk(id);
      if (!compra) {
        res.status(404).json({ error: 'Compra não encontrada.' });
        return;
      }

      await ItemCompra.destroy({ where: { compraId: compra.id }, transaction });
      await compra.destroy({ transaction });

      await transaction.commit();
      res.status(200).json({ message: 'Compra deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar compra:', error);
      await transaction.rollback();
      res.status(500).json({ error: 'Erro ao deletar compra.' });
    }
  }
}

export default new CompraController();
