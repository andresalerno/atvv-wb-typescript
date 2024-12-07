import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Cliente, Produto, Servico } from '../../../types';

const CadastroCompra: React.FC = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [clienteId, setClienteId] = useState<string>('');
    const [itensCompra, setItensCompra] = useState<{ tipo: 'produto' | 'servico'; itemId: number; quantidade: number }[]>([]);
    const [valorTotal, setValorTotal] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        buscarClientes();
        buscarProdutos();
        buscarServicos();
    }, []);

    const buscarClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/clientes');
            setClientes(response.data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            alert('Não foi possível carregar a lista de clientes.');
        }
    };

    const buscarProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/produtos');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            alert('Não foi possível carregar a lista de produtos.');
        }
    };

    const buscarServicos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/servicos');
            setServicos(response.data);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            alert('Não foi possível carregar a lista de serviços.');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClienteId(event.target.value);
    };

    const handleAdicionarItem = (tipo: 'produto' | 'servico', itemId: number) => {
        const jaExiste = itensCompra.find(item => item.tipo === tipo && item.itemId === itemId);

        if (jaExiste) {
            setItensCompra(itensCompra.map(item =>
                item.tipo === tipo && item.itemId === itemId
                    ? { ...item, quantidade: item.quantidade + 1 }
                    : item
            ));
        } else {
            setItensCompra([...itensCompra, { tipo, itemId, quantidade: 1 }]);
        }
    };

    const atualizarValorTotal = () => {
        let total = 0;
        itensCompra.forEach(item => {
            const produtoOuServico =
                item.tipo === 'produto'
                    ? produtos.find(prod => prod.id === item.itemId)
                    : servicos.find(serv => serv.id === item.itemId);

            if (produtoOuServico) {
                total += produtoOuServico.preco * item.quantidade;
            }
        });
        setValorTotal(total);
    };

    useEffect(() => {
        atualizarValorTotal();
    }, [itensCompra]);

    const handleCadastrar = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!clienteId) {
            alert('Por favor, selecione um cliente.');
            return;
        }

        if (itensCompra.length === 0) {
            alert('Adicione pelo menos um item.');
            return;
        }

        try {
            const novaCompra = { clienteId: parseInt(clienteId), itensCompra, total: valorTotal };
            await axios.post('http://localhost:5000/compras', novaCompra);
            alert('Compra cadastrada com sucesso!');
            navigate('/compras');
        } catch (error) {
            console.error('Erro ao cadastrar compra:', error);
            alert('Não foi possível cadastrar a compra.');
        }
    };

    return (
        <div className="container">
            <h2>Cadastro de Compra</h2>
            <form onSubmit={handleCadastrar}>
                <div>
                    <label>Selecione o Cliente:</label>
                    <select value={clienteId} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h4>Adicionar Produtos:</h4>
                    {produtos.map(produto => (
                        <button
                            type="button"
                            key={produto.id}
                            onClick={() => handleAdicionarItem('produto', produto.id)}
                        >
                            {produto.nome}
                        </button>
                    ))}
                </div>

                <div>
                    <h4>Adicionar Serviços:</h4>
                    {servicos.map(servico => (
                        <button
                            type="button"
                            key={servico.id}
                            onClick={() => handleAdicionarItem('servico', servico.id)}
                        >
                            {servico.nome}
                        </button>
                    ))}
                </div>

                <div>
                    <h4>Itens da Compra:</h4>
                    <ul>
                        {itensCompra.map((item, index) => (
                            <li key={index}>
                                {item.tipo === 'produto'
                                    ? produtos.find(prod => prod.id === item.itemId)?.nome
                                    : servicos.find(serv => serv.id === item.itemId)?.nome}{' '}
                                - Quantidade: {item.quantidade}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4>Total: R$ {valorTotal.toFixed(2)}</h4>
                </div>

                <button type="submit">Cadastrar Compra</button>
            </form>
        </div>
    );
};

export default CadastroCompra;
