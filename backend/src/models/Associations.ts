import Cliente from '@models/Cliente';
import Compra from '@models/Compra';
import Produto from '@models/Produto';
import Servico from '@models/Servico';
import ItemCompra from '@models/ItemCompra';

export default function setupAssociations() {
  // Cliente - Compra (Um para muitos)
  Cliente.hasMany(Compra, {
    foreignKey: 'clienteId',
    as: 'comprasCliente',
  });
  Compra.belongsTo(Cliente, {
    foreignKey: 'clienteId',
    as: 'cliente',
  });

  // Compra - ItemCompra (Um para muitos)
  Compra.hasMany(ItemCompra, {
    foreignKey: 'compraId',
    as: 'itensDaCompra', // Cada compra pode ter muitos itens (produtos ou serviços)
  });
  ItemCompra.belongsTo(Compra, {
    foreignKey: 'compraId',
    as: 'compra', // Cada item de compra pertence a uma compra
  });

  // ItemCompra - Produto e Servico (relacionamento polimórfico)
  ItemCompra.belongsTo(Produto, {
    foreignKey: 'itemId',
    as: 'produtoAssociado',
    constraints: false, // Constraints desativadas para evitar restrições de FK, pois 'itemId' pode se referir a produtos ou serviços
  });
  ItemCompra.belongsTo(Servico, {
    foreignKey: 'itemId',
    as: 'servicoAssociado',
    constraints: false,
  });

  // Produto - ItemCompra (relacionamento opcional inverso)
  Produto.hasMany(ItemCompra, {
    foreignKey: 'itemId',
    as: 'itensComprados',
    constraints: false, // Produto pode estar associado a múltiplos itens de compra
  });

  // Servico - ItemCompra (relacionamento opcional inverso)
  Servico.hasMany(ItemCompra, {
    foreignKey: 'itemId',
    as: 'servicosComprados',
    constraints: false, // Serviço pode estar associado a múltiplos itens de compra
  });
}
