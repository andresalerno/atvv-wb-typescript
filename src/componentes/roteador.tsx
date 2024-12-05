import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarraNavegacao from './barraNavegacao';
import CadastroCliente from '../pages/Clientes/Cadastro';
import CadastroProduto from '../pages/Produtos/Cadastro';
import CadastroServico from '../pages/Servicos/Cadastro';
import CadastroCompra from '../pages/Compras/Cadastro';
import ListagemCliente from '../pages/Clientes/Listagem';
import ListagemProduto from '../pages/Produtos/Listagem';
import ListagemServico from '../pages/Servicos/Listagem';
import ListagemCompras from '../pages/Compras/Listagem';
import Top10MaisConsumiram from '../pages/Clientes/Listagem/Top10MaisConsumira';
import Top10MenosConsumiram from '../pages/Clientes/Listagem/Top10MenosConsumiram';
import Top5MaisConsumiramValor from '../pages/Clientes/Listagem/Top5MaisConsumiramValor';
import ListagemPorGenero from '../pages/Clientes/Listagem/ListagemPorGenero';
import ListagemProdutosMaisConsumidos from '../pages/Produtos/Listagem/ListagemProdutosMaisConsumidos';
import ListagemServicosMaisConsumidos from '../pages/Servicos/Listagem/ListagemServicosMaisConsumidos';
import ListagemProdutosMaisConsumidosPorGenero from '../pages/Produtos/Listagem/ListagemProdutosMaisConsumidosPorGenero';
import ListagemServicosMaisConsumidosPorGenero from '../pages/Servicos/Listagem/ListagemServicosMaisConsumidosPorGenero';
import EdicaoCliente from '../pages/Clientes/Edicao';
import EdicaoProduto from '../pages/Produtos/Edicao';
import EdicaoServico from '../pages/Servicos/Edicao';
import HomePage from '../pages/Home';
import DetalhesCompra from '../pages/Compras/Detalhe';
import DetalhesCliente from '../pages/Clientes/Detalhe';

const Roteador: React.FC = () => {
    const [clientes, setClientes] = useState<any[]>([
        { id: 1, nome: 'João Silva', nomeSocial: 'Joãozinho', cpf: '123.456.789-00', dataEmissao: '01/01/2020', genero: 'Masculino' },
        { id: 2, nome: 'Maria Oliveira', nomeSocial: 'Maria', cpf: '987.654.321-00', dataEmissao: '05/03/2021', genero: 'Feminino' },
        { id: 3, nome: 'Carlos Souza', nomeSocial: '', cpf: '456.789.123-00', dataEmissao: '12/12/2019', genero: 'Outro' },
    ]);
    const [produtos, setProdutos] = useState<any[]>([
        { id: 1, nome: 'Cadeira Gamer', preco: 1500.0 },
        { id: 2, nome: 'Mesa de Escritório', preco: 600.0 },
        { id: 3, nome: 'Monitor Full HD', preco: 800.0 },
        { id: 4, nome: 'Teclado Mecânico', preco: 350.0 },
        { id: 5, nome: 'Mouse Sem Fio', preco: 200.0 },
    ]);
    const [servicos, setServicos] = useState<any[]>([
        { id: 1, nome: 'Manutenção de Computadores', preco: 200.0 },
        { id: 2, nome: 'Instalação de Software', preco: 100.0 },
        { id: 3, nome: 'Reparos Elétricos', preco: 300.0 },
    ]);
    const [compras, setCompras] = useState<any[]>([
        {
            id: 1,
            clienteId: 1,
            data: '2023-12-01T10:00:00',
            produtos: [{ id: 1, nome: 'Cadeira Gamer', preco: 1500.0, quantidade: 1 }],
            servicos: [{ id: 1, nome: 'Manutenção de Computadores', preco: 200.0, quantidade: 1 }]
        },
        {
            id: 2,
            clienteId: 2,
            data: '2023-12-05T14:30:00',
            produtos: [{ id: 2, nome: 'Mesa de Escritório', preco: 600.0, quantidade: 2 }],
            servicos: [{ id: 2, nome: 'Instalação de Software', preco: 100.0, quantidade: 1 }]
        }
    ]);

    const atualizarValorConsumido = () => {
        const clientesAtualizados = clientes.map(cliente => {
            const comprasCliente = compras.filter(compra => compra.clienteId === cliente.id);
            const valorConsumido = comprasCliente.reduce((total: number, compra: any) => {
                const valorProdutos = compra.produtos.reduce((subtotal: number, produto: { preco: number; quantidade: number }) => {
                    return subtotal + (produto.preco * produto.quantidade);
                }, 0);

                const valorServicos = compra.servicos.reduce((subtotal: number, servico: { preco: number; quantidade: number }) => {
                    return subtotal + (servico.preco * servico.quantidade);
                }, 0);

                return total + valorProdutos + valorServicos;
            }, 0);

            return {
                ...cliente,
                valorConsumido,
            };
        });

        setClientes(clientesAtualizados);
    };

    useEffect(() => {
        atualizarValorConsumido();
    }, [compras]);

    return (
        <Router>
            <BarraNavegacao
                tema="navbar-dark bg-primary"
                botoes={[
                    {
                        texto: 'Gerenciar Clientes',
                        rota: '/clientes',
                        icone: 'person',
                        submenus: [
                            { texto: 'Listar Todos os Clientes', rota: '/clientes/listar' },
                            { texto: 'Top 10 Mais Consumiram', rota: '/clientes/top10-mais' },
                            { texto: 'Top 10 Menos Consumiram', rota: '/clientes/top10-menos' },
                            { texto: 'Top 5 Mais Consumiram em Valor', rota: '/clientes/top5-valor' },
                            { texto: 'Listar por Gênero', rota: '/clientes/genero' }
                        ]
                    },
                    {
                        texto: 'Gerenciar Compras',
                        rota: '/compras',
                        icone: 'receipt',
                        submenus: [
                            { texto: 'Cadastrar Compra', rota: '/cadastrar-compra' },
                            { texto: 'Listar Compras', rota: '/compras/listar' },
                        ]
                    },
                    {
                        texto: 'Gerenciar Produtos',
                        rota: '/produtos',
                        icone: 'shopping_cart',
                        submenus: [
                            { texto: 'Cadastrar Produto', rota: '/cadastrar-produto' },
                            { texto: 'Listagem Produtos', rota: '/produtos' },
                            { texto: 'Listar Produtos Mais Consumidos', rota: '/compras/produtos-mais-consumidos' },
                            { texto: 'Listar Produtos Mais Consumidos por Gênero', rota: '/compras/produtos-mais-consumidos-genero' },
                        ]
                    },
                    {
                        texto: 'Gerenciar Serviços',
                        rota: '/servicos',
                        icone: 'build',
                        submenus: [
                            { texto: 'Cadastrar Serviço', rota: '/cadastrar-servico' },
                            { texto: 'Listagem Serviços', rota: '/servicos' },
                            { texto: 'Listar Serviços Mais Consumidos', rota: '/compras/servicos-mais-consumidos' },
                            { texto: 'Listar Serviços Mais Consumidos por Gênero', rota: '/compras/servicos-por-genero'},
                        ]
                    }
                ]}
            />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/clientes" element={<ListagemCliente clientes={clientes} setClientes={setClientes} />} />
                <Route path="/clientes/listar" element={<ListagemCliente clientes={clientes} setClientes={setClientes} />} />
                <Route path="/clientes/top10-mais" element={<Top10MaisConsumiram clientes={clientes} compras={compras} />} />
                <Route path="/clientes/:id/detalhes" element={<DetalhesCliente clientes={clientes} compras={compras} />} />
                <Route path="/clientes/top10-menos" element={<Top10MenosConsumiram clientes={clientes} />} />
                <Route path="/clientes/top5-valor" element={<Top5MaisConsumiramValor clientes={clientes} />} />
                <Route path="/clientes/genero" element={<ListagemPorGenero clientes={clientes} setClientes={setClientes} />} />
                <Route path="/cadastrar-cliente" element={<CadastroCliente clientes={clientes} setClientes={setClientes} />} />
                <Route path="/editar-cliente/:id" element={<EdicaoCliente clientes={clientes} setClientes={setClientes} />} />
                <Route path="/produtos" element={<ListagemProduto produtos={produtos} setProdutos={setProdutos} />} />
                <Route path="/cadastrar-produto" element={<CadastroProduto produtos={produtos} setProdutos={setProdutos} />} />
                <Route path="/editar-produto/:id" element={<EdicaoProduto produtos={produtos} setProdutos={setProdutos} />} />
                <Route path="/servicos" element={<ListagemServico servicos={servicos} setServicos={setServicos} />} />
                <Route path="/cadastrar-servico" element={<CadastroServico servicos={servicos} setServicos={setServicos} />} />
                <Route path="/editar-servico/:id" element={<EdicaoServico servicos={servicos} setServicos={setServicos} />} />
                <Route path="/cadastrar-compra" element={<CadastroCompra clientes={clientes} produtos={produtos} servicos={servicos} setCompras={setCompras} />} />
                <Route path="/compras" element={<ListagemCompras compras={compras} clientes={clientes} />} />
                <Route path="/detalhes-compra/:id" element={<DetalhesCompra compras={compras} />} />
                <Route path="/compras/produtos-mais-consumidos" element={<ListagemProdutosMaisConsumidos compras={compras} />} />
                <Route path="/compras/produtos-mais-consumidos-genero" element={<ListagemProdutosMaisConsumidosPorGenero clientes={clientes} compras={compras} />} />
                <Route path="/compras/servicos-mais-consumidos" element={<ListagemServicosMaisConsumidos compras={compras} />} />
                <Route path="/compras/produtos-por-genero" element={<ListagemProdutosMaisConsumidosPorGenero clientes={clientes} compras={compras} />} />
                <Route path="/compras/servicos-por-genero" element={<ListagemServicosMaisConsumidosPorGenero clientes={clientes} compras={compras} />} />
            </Routes>
        </Router>
    );
};

export default Roteador;
