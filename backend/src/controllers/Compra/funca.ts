import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import sequelize from '@connections';
import Compra from '@models/Compra';
import ItemCompra from '@models/ItemCompra';
import Cliente from '@models/Cliente';
import Produto from '@models/Produto';
import Servico from '@models/Servico';

export default async function addItensCompra(itensCompra: any[], compraId: number, transaction: Transaction): Promise<number> {
    let valorTotal = 0;

    for (const item of itensCompra) {
      const { tipo, itemId, quantidade } = item;

      if (tipo === 'produto') {
        const produto = await Produto.findByPk(itemId);
        if (produto) {
          await ItemCompra.create({
            compraId: compraId,
            tipo: tipo,
            itemId: itemId,
            quantidade: quantidade,
            precoUnitario: produto.preco,
            subtotal: produto.preco * quantidade,
          }, { transaction });
          valorTotal += produto.preco * quantidade;
        }
      } else if (tipo === 'servico') {
        const servico = await Servico.findByPk(itemId);
        if (servico) {
          await ItemCompra.create({
            compraId: compraId,
            tipo: tipo,
            itemId: itemId,
            quantidade: quantidade,
            precoUnitario: servico.preco,
            subtotal: servico.preco * quantidade,
          }, { transaction });
          valorTotal += servico.preco * quantidade;
        }
      }
    }

    return valorTotal;
  }