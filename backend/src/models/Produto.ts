import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';


interface ProdutoAttributes {
  id: number;
  nome: string;
  preco: number;
}


interface ProdutoCreationAttributes extends Optional<ProdutoAttributes, 'id'> {}


class Produto extends Model<ProdutoAttributes, ProdutoCreationAttributes> implements ProdutoAttributes {
  public id!: number;
  public nome!: string;
  public preco!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Inicialização do modelo com o Sequelize
Produto.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'O nome do produto é obrigatório.',
        },
      },
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'O preço deve ser um número válido.',
        },
        min: {
          args: [0.01],
          msg: 'O preço deve ser maior que zero.',
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Produto',
    tableName: 'produtos',
    timestamps: true,
  }
);

export default Produto;
