import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';


interface ServicoAttributes {
  id: number;
  nome: string;
  preco: number;
}


interface ServicoCreationAttributes extends Optional<ServicoAttributes, 'id'> {}


class Servico extends Model<ServicoAttributes, ServicoCreationAttributes> implements ServicoAttributes {
  public id!: number;
  public nome!: string;
  public preco!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  static preco: number;
}

// Inicialização do modelo com o Sequelize
Servico.init(
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
          msg: 'O nome do serviço é obrigatório.',
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
    modelName: 'Servico',
    tableName: 'servicos',
    timestamps: true,
  }
);

export default Servico;
