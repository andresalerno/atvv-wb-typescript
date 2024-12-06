import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';
import Cliente from './Cliente';
import ItemCompra from './ItemCompra';

interface CompraAttributes {
  id: number;
  clienteId: number;
  dataEvento: Date;
  totalGeral: number;
}

interface CompraCreationAttributes extends Optional<CompraAttributes, 'id'> {}

class Compra extends Model<CompraAttributes, CompraCreationAttributes> implements CompraAttributes {
  public id!: number;
  public clienteId!: number;
  public dataEvento!: Date;
  public totalGeral!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static associate() {
    Compra.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
    Compra.hasMany(ItemCompra, { foreignKey: 'compraId', as: 'itensDaCompra' }); // Certifique-se de usar 'itensDaCompra' para correspondência com o JSON
  }
}

Compra.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    clienteId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Cliente,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    dataEvento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    totalGeral: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Compra',
    tableName: 'compras',
    timestamps: true,
  }
);

export default Compra;
