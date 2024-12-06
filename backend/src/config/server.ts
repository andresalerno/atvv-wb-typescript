import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '@connections';
import ClienteRoutes from '@routes/ClienteRoutes';
import ProdutoRoutes from '@routes/ProdutoRoutes';
import ServicoRoutes from '@routes/ServicoRoutes';
import CompraRoutes from '@routes/CompraRoutes';
import setupAssociations from '@models/Associations';
import * as fs from 'fs';
import path from 'path';
import Cliente from '@models/Cliente';
import Produto from '@models/Produto';
import Servico from '@models/Servico';
import Compra from '@models/Compra';
import CompraProduto from '@models/CompraProduto';
import CompraServico from '@models/CompraServico';
import ItemCompra from '@models/ItemCompra';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/clientes', ClienteRoutes);
app.use('/produtos', ProdutoRoutes);
app.use('/servicos', ServicoRoutes);
app.use('/compras', CompraRoutes);

setupAssociations();

async function importarClientes() {
  try {
    // Verifica se já existem clientes no banco de dados
    const count = await Cliente.count();

    if (count > 0) {
      console.log("Os clientes já foram importados anteriormente.");
      return; // Se já existem clientes, não faça nada
    }

    // Se não houver clientes, importe do arquivo JSON
    const caminhoArquivo = path.resolve(__dirname, '../data/clientes.json'); // Caminho para o arquivo JSON
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
    const clientesImportados = JSON.parse(dados);

    // Itera sobre os dados e cria novas entradas no banco de dados
    for (const cliente of clientesImportados) {
      await Cliente.create({
        id: cliente.id,
        nome: cliente.nome,
        nomeSocial: cliente.nomeSocial,
        cpfValor: cliente.cpf.valor,
        cpfDataEmissao: new Date(cliente.cpf.dataEmissao),
        genero: cliente.genero
      });
    }

    console.log("Clientes importados com sucesso!");
  } catch (erro) {
    console.error("Erro ao importar clientes: ", erro);
  }
}

async function importarProdutos() {
  try {
    // Verifica se já existem produtos no banco de dados
    const count = await Produto.count();

    if (count > 0) {
      console.log("Os produtos já foram importados anteriormente.");
      return; // Se já existem produtos, não faça nada
    }

    // Se não houver produtos, importe do arquivo JSON
    const caminhoArquivo = path.resolve(__dirname, '../data/produtos.json');
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
    const produtosImportados = JSON.parse(dados);

    // Itera sobre os dados e cria novas entradas no banco de dados
    for (const produto of produtosImportados) {
      await Produto.create({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco
      });
    }

    console.log("Produtos importados com sucesso!");
  } catch (erro) {
    console.error("Erro ao importar produtos: ", erro);
  }
}

async function importarServicos() {
  try {

    const count = await Servico.count();

    if (count > 0) {
      console.log("Os serviços já foram importados anteriormente.");
      return;
    }


    const caminhoArquivo = path.resolve(__dirname, '../data/servicos.json'); 
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
    const servicosImportados = JSON.parse(dados);


    for (const servico of servicosImportados) {
      await Servico.create({
        id: servico.id,
        nome: servico.descricao,
        preco: servico.preco
      });
    }

    console.log("Serviços importados com sucesso!");
  } catch (erro) {
    console.error("Erro ao importar serviços: ", erro);
  }
}

async function importarCompras() {
  try {
    // Verifica se já existem compras no banco de dados
    const count = await Compra.count();

    if (count > 0) {
      console.log("As compras já foram importadas anteriormente.");
      return; // Se já existem compras, não faça nada
    }

    // Se não houver compras, importe do arquivo JSON
    const caminhoArquivo = path.resolve(__dirname, '../data/compras.json'); // Caminho para o arquivo JSON
    const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
    const comprasImportadas = JSON.parse(dados);

    // Itera sobre os dados e cria novas entradas no banco de dados
    for (const compra of comprasImportadas) {
      const novaCompra = await Compra.create({
        id: compra.id,
        clienteId: compra.clienteId,
        dataEvento: new Date(compra.dataEvento),
        totalGeral: compra.totalGeral,
      });

      // Adiciona itens à compra (produtos ou serviços)
      for (const item of compra.itensDaCompra) {
        let precoUnitario = 0;

        if (item.tipo === 'produto') {
          const produto = await Produto.findByPk(item.itemId);
          if (produto) {
            precoUnitario = produto.preco;
          }
        } else if (item.tipo === 'servico') {
          const servico = await Servico.findByPk(item.itemId);
          if (servico) {
            precoUnitario = servico.preco;
          }
        }

        if (precoUnitario > 0) {
          await ItemCompra.create({
            compraId: novaCompra.id,
            tipo: item.tipo,
            itemId: item.itemId,
            quantidade: item.quantidade,
            precoUnitario: precoUnitario,
            subtotal: precoUnitario * item.quantidade,
          });
        }
      }
    }

    console.log("Compras importadas com sucesso!");
  } catch (erro) {
    console.error("Erro ao importar compras: ", erro);
  }
}





sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('Banco de dados sincronizado com sucesso!');


    await importarClientes();
    await importarProdutos();
    await importarServicos();
    await importarCompras();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
    process.exit(1);
  });
