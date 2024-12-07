"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const _connections_1 = __importDefault(require("@connections"));
const ClienteRoutes_1 = __importDefault(require("@routes/ClienteRoutes"));
const ProdutoRoutes_1 = __importDefault(require("@routes/ProdutoRoutes"));
const ServicoRoutes_1 = __importDefault(require("@routes/ServicoRoutes"));
const CompraRoutes_1 = __importDefault(require("@routes/CompraRoutes"));
const Associations_1 = __importDefault(require("@models/Associations"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const Cliente_1 = __importDefault(require("@models/Cliente"));
const Produto_1 = __importDefault(require("@models/Produto"));
const Servico_1 = __importDefault(require("@models/Servico"));
const Compra_1 = __importDefault(require("@models/Compra"));
const ItemCompra_1 = __importDefault(require("@models/ItemCompra"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/clientes', ClienteRoutes_1.default);
app.use('/produtos', ProdutoRoutes_1.default);
app.use('/servicos', ServicoRoutes_1.default);
app.use('/compras', CompraRoutes_1.default);
(0, Associations_1.default)();
function importarClientes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica se já existem clientes no banco de dados
            const count = yield Cliente_1.default.count();
            if (count > 0) {
                console.log("Os clientes já foram importados anteriormente.");
                return; // Se já existem clientes, não faça nada
            }
            // Se não houver clientes, importe do arquivo JSON
            const caminhoArquivo = path_1.default.resolve(__dirname, '../data/clientes.json'); // Caminho para o arquivo JSON
            const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
            const clientesImportados = JSON.parse(dados);
            // Itera sobre os dados e cria novas entradas no banco de dados
            for (const cliente of clientesImportados) {
                yield Cliente_1.default.create({
                    id: cliente.id,
                    nome: cliente.nome,
                    nomeSocial: cliente.nomeSocial,
                    cpfValor: cliente.cpf.valor,
                    cpfDataEmissao: new Date(cliente.cpf.dataEmissao),
                    genero: cliente.genero
                });
            }
            console.log("Clientes importados com sucesso!");
        }
        catch (erro) {
            console.error("Erro ao importar clientes: ", erro);
        }
    });
}
function importarProdutos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica se já existem produtos no banco de dados
            const count = yield Produto_1.default.count();
            if (count > 0) {
                console.log("Os produtos já foram importados anteriormente.");
                return; // Se já existem produtos, não faça nada
            }
            // Se não houver produtos, importe do arquivo JSON
            const caminhoArquivo = path_1.default.resolve(__dirname, '../data/produtos.json');
            const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
            const produtosImportados = JSON.parse(dados);
            // Itera sobre os dados e cria novas entradas no banco de dados
            for (const produto of produtosImportados) {
                yield Produto_1.default.create({
                    id: produto.id,
                    nome: produto.nome,
                    preco: produto.preco
                });
            }
            console.log("Produtos importados com sucesso!");
        }
        catch (erro) {
            console.error("Erro ao importar produtos: ", erro);
        }
    });
}
function importarServicos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield Servico_1.default.count();
            if (count > 0) {
                console.log("Os serviços já foram importados anteriormente.");
                return;
            }
            const caminhoArquivo = path_1.default.resolve(__dirname, '../data/servicos.json');
            const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
            const servicosImportados = JSON.parse(dados);
            for (const servico of servicosImportados) {
                yield Servico_1.default.create({
                    id: servico.id,
                    nome: servico.descricao,
                    preco: servico.preco
                });
            }
            console.log("Serviços importados com sucesso!");
        }
        catch (erro) {
            console.error("Erro ao importar serviços: ", erro);
        }
    });
}
function importarCompras() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verifica se já existem compras no banco de dados
            const count = yield Compra_1.default.count();
            if (count > 0) {
                console.log("As compras já foram importadas anteriormente.");
                return; // Se já existem compras, não faça nada
            }
            // Se não houver compras, importe do arquivo JSON
            const caminhoArquivo = path_1.default.resolve(__dirname, '../data/compras.json'); // Caminho para o arquivo JSON
            const dados = fs.readFileSync(caminhoArquivo, 'utf-8');
            const comprasImportadas = JSON.parse(dados);
            // Itera sobre os dados e cria novas entradas no banco de dados
            for (const compra of comprasImportadas) {
                const novaCompra = yield Compra_1.default.create({
                    id: compra.id,
                    clienteId: compra.clienteId,
                    dataEvento: new Date(compra.dataEvento),
                    totalGeral: compra.totalGeral,
                });
                // Adiciona itens à compra (produtos ou serviços)
                for (const item of compra.itensDaCompra) {
                    let precoUnitario = 0;
                    if (item.tipo === 'produto') {
                        const produto = yield Produto_1.default.findByPk(item.itemId);
                        if (produto) {
                            precoUnitario = produto.preco;
                        }
                    }
                    else if (item.tipo === 'servico') {
                        const servico = yield Servico_1.default.findByPk(item.itemId);
                        if (servico) {
                            precoUnitario = servico.preco;
                        }
                    }
                    if (precoUnitario > 0) {
                        yield ItemCompra_1.default.create({
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
        }
        catch (erro) {
            console.error("Erro ao importar compras: ", erro);
        }
    });
}
_connections_1.default
    .sync({ alter: true })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Banco de dados sincronizado com sucesso!');
    yield importarClientes();
    yield importarProdutos();
    yield importarServicos();
    yield importarCompras();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}))
    .catch((error) => {
    console.error('Erro ao sincronizar o banco de dados:', error);
    process.exit(1);
});
