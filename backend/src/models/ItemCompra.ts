import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';
import Compra from './Compra';
import Produto from './Produto';
import Servico from './Servico';

interface ItemCompraAttributes {
  id: number;
  compraId: number;
  tipo: 'produto' | 'servico';
  itemId: number;
  quantidade: number;
  subtotal: number;
  precoUnitario: number;
}

interface ItemCompraCreationAttributes extends Optional<ItemCompraAttributes, 'id' | 'subtotal'> {}

class ItemCompra extends Model<ItemCompraAttributes, ItemCompraCreationAttributes> implements ItemCompraAttributes {
  public id!: number;
  public compraId!: number;
  public tipo!: 'produto' | 'servico';
  public itemId!: number;
  public quantidade!: number;
  public subtotal!: number;
  public precoUnitario!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate() {
    ItemCompra.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
    ItemCompra.belongsTo(Produto, { foreignKey: 'itemId', as: 'produtoAssociado' });
    ItemCompra.belongsTo(Servico, { foreignKey: 'itemId', as: 'servicoAssociado' });    
  }
}

ItemCompra.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    compraId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Compra,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    tipo: {
      type: DataTypes.ENUM('produto', 'servico'),
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    precoUnitario: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ItemCompra',
    tableName: 'itensCompra',
    timestamps: false,
  }
);

export default ItemCompra;
