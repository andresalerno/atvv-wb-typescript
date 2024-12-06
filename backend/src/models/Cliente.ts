import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@connections";
import Compra from "./Compra";  // Se houver relação com compras, inclua aqui

// Definindo atributos do modelo Cliente
interface ClienteAttributes {
  id: number;
  nome: string;
  nomeSocial?: string;
  cpfValor: string;
  cpfDataEmissao: Date;
  genero: "MASCULINO" | "FEMININO" | "OUTRO" | "NAODECLARAR";
}

// Definindo atributos necessários para criar um Cliente
interface ClienteCreationAttributes extends Optional<ClienteAttributes, "id" | "nomeSocial"> {}

class Cliente extends Model<ClienteAttributes, ClienteCreationAttributes> implements ClienteAttributes {
  public id!: number;
  public nome!: string;
  public nomeSocial?: string;
  public cpfValor!: string;
  public cpfDataEmissao!: Date;
  public genero!: "MASCULINO" | "FEMININO" | "OUTRO" | "NAODECLARAR";

  // Timestamps padrão
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associações (se houver relação com Compra, por exemplo)
  public static associate() {
    Cliente.hasMany(Compra, { foreignKey: 'clienteId', as: 'compras' });
  }
}

// Inicializando o modelo Cliente
Cliente.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,  // Use UNSIGNED se quiser garantir valores positivos
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeSocial: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cpfValor: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    cpfDataEmissao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    genero: {
      type: DataTypes.ENUM("MASCULINO", "FEMININO", "OUTRO", "NAODECLARAR"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "clientes",
    timestamps: true, 
  }
);


export default Cliente;
