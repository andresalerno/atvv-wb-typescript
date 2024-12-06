import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';
import Compra from '@models/Compra';
import Produto from '@models/Produto';

interface CompraProdutoAttributes {
  compraId: number;
  produtoId: number;
  quantidade: number;
  subtotal: number;
}

interface CompraProdutoCreationAttributes extends Optional<CompraProdutoAttributes, 'subtotal'> {}

class CompraProduto extends Model<CompraProdutoAttributes, CompraProdutoCreationAttributes> implements CompraProdutoAttributes {
  public compraId!: number;
  public produtoId!: number;
  public quantidade!: number;
  public subtotal!: number;

  // Associações
  public static associate() {
    CompraProduto.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
    CompraProduto.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });
  }
}

// Inicializando o modelo
CompraProduto.init(
  {
    compraId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Compra,
        key: 'id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    produtoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Produto,
        key: 'id',
      },
      onDelete: 'CASCADE',
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
  },
  {
    sequelize,
    modelName: 'CompraProduto',
    tableName: 'compra_produto',
    timestamps: false,
  }
);

// Hooks para calcular o subtotal automaticamente
CompraProduto.beforeCreate(async (compraProduto, options) => {
  const produto = await Produto.findByPk(compraProduto.produtoId);
  if (produto) {
    compraProduto.subtotal = produto.preco * compraProduto.quantidade;
  }
});

CompraProduto.beforeUpdate(async (compraProduto, options) => {
  const produto = await Produto.findByPk(compraProduto.produtoId);
  if (produto) {
    compraProduto.subtotal = produto.preco * compraProduto.quantidade;
  }
});

// Relacionamentos
Compra.hasMany(CompraProduto, { foreignKey: 'compraId', as: 'itensCompra' });
Produto.hasMany(CompraProduto, { foreignKey: 'produtoId', as: 'comprasAssociadas' });
CompraProduto.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
CompraProduto.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

export default CompraProduto;
