import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@connections';
import Compra from '@models/Compra';
import Servico from '@models/Servico';

interface CompraServicoAttributes {
  compraId: number;
  servicoId: number;
  quantidade: number;
  subtotal: number;
}

interface CompraServicoCreationAttributes extends Optional<CompraServicoAttributes, 'subtotal'> {}

class CompraServico extends Model<CompraServicoAttributes, CompraServicoCreationAttributes> implements CompraServicoAttributes {
  public compraId!: number;
  public servicoId!: number;
  public quantidade!: number;
  public subtotal!: number;

  // Associações
  public static associate() {
    CompraServico.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
    CompraServico.belongsTo(Servico, { foreignKey: 'servicoId', as: 'servico' });
  }
}

// Inicializando o modelo
CompraServico.init(
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
    servicoId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Servico,
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
    modelName: 'CompraServico',
    tableName: 'compra_servico',
    timestamps: false,
  }
);

// Hooks para calcular o subtotal automaticamente
CompraServico.beforeCreate(async (compraServico, options) => {
  const servico = await Servico.findByPk(compraServico.servicoId);
  if (servico) {
    compraServico.subtotal = servico.preco * compraServico.quantidade;
  }
});

CompraServico.beforeUpdate(async (compraServico, options) => {
  const servico = await Servico.findByPk(compraServico.servicoId);
  if (servico) {
    compraServico.subtotal = servico.preco * compraServico.quantidade;
  }
});

// Relacionamentos
Compra.hasMany(CompraServico, { foreignKey: 'compraId', as: 'itensServico' });
Servico.hasMany(CompraServico, { foreignKey: 'servicoId', as: 'comprasAssociadas' });
CompraServico.belongsTo(Compra, { foreignKey: 'compraId', as: 'compra' });
CompraServico.belongsTo(Servico, { foreignKey: 'servicoId', as: 'servico' });

export default CompraServico;
