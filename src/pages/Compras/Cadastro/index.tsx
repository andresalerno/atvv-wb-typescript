import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipos de Props para CadastroCompra
interface CadastroCompraProps {
    clientes: any[];
    produtos: any[];
    servicos: any[];
    setCompras: React.Dispatch<React.SetStateAction<any[]>>;
}

const CadastroCompra: React.FC<CadastroCompraProps> = ({ clientes, produtos, servicos, setCompras }) => {
    const [clienteId, setClienteId] = useState<string>('');
    const [itensCompra, setItensCompra] = useState<{ tipo: 'produto' | 'servico'; id: number; quantidade: number }[]>([]);
    const [valorTotal, setValorTotal] = useState<number>(0);
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'clienteId') {
            setClienteId(value);
        }
    };

    const handleAdicionarItem = (tipo: 'produto' | 'servico', id: number) => {
        setItensCompra(prevItens => [...prevItens, { tipo, id, quantidade: 1 }]);
        atualizarValorTotal([...itensCompra, { tipo, id, quantidade: 1 }]);
    };

    const handleQuantidadeChange = (index: number, quantidade: number) => {
        const novosItens = [...itensCompra];
        novosItens[index].quantidade = quantidade;
        setItensCompra(novosItens);
        atualizarValorTotal(novosItens);
    };

    const atualizarValorTotal = (itens: typeof itensCompra) => {
        let total = 0;
        itens.forEach(item => {
            if (item.tipo === 'produto') {
                const produto = produtos.find(prod => prod.id === item.id);
                if (produto) {
                    total += produto.preco * item.quantidade;
                }
            } else if (item.tipo === 'servico') {
                const servico = servicos.find(serv => serv.id === item.id);
                if (servico) {
                    total += servico.preco * item.quantidade;
                }
            }
        });
        setValorTotal(total);
    };

    const handleCadastrar = (e: React.FormEvent) => {
        e.preventDefault();

        if (!clienteId) {
            alert('Por favor, selecione um cliente.');
            return;
        }

        if (itensCompra.length === 0) {
            alert('Por favor, adicione pelo menos um produto ou serviço à compra.');
            return;
        }

        const cliente = clientes.find(cli => cli.id === parseInt(clienteId));
        if (!cliente) {
            alert('Cliente inválido.');
            return;
        }

        const itensComDetalhes = itensCompra.map(item => {
            if (item.tipo === 'produto') {
                const produto = produtos.find(prod => prod.id === item.id);
                if (produto) {
                    return { ...item, preco: produto.preco, nome: produto.nome };
                }
            } else if (item.tipo === 'servico') {
                const servico = servicos.find(serv => serv.id === item.id);
                if (servico) {
                    return { ...item, preco: servico.preco, nome: servico.nome };
                }
            }
            return null;
        }).filter(item => item !== null);

        const novaCompra = {
            id: Math.floor(Math.random() * 10000),
            clienteId: parseInt(clienteId),
            data: new Date().toISOString(),
            produtos: itensComDetalhes.filter(item => item?.tipo === 'produto'),
            servicos: itensComDetalhes.filter(item => item?.tipo === 'servico'),
            valorTotal,
        };

        setCompras(prev => [...prev, novaCompra]);
        alert('Compra cadastrada com sucesso!');
        navigate('/compras');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Compra</h2>
            <form onSubmit={handleCadastrar}>
                <div className="mb-3">
                    <label className="form-label">(*) Selecione o Cliente:</label>
                    <select
                        name="clienteId"
                        value={clienteId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Adicionar Produtos:</label>
                    <div>
                        {produtos.map(produto => (
                            <button
                                type="button"
                                key={produto.id}
                                className="btn btn-secondary btn-sm me-2 mb-2"
                                onClick={() => handleAdicionarItem('produto', produto.id)}
                            >
                                {produto.nome}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Adicionar Serviços:</label>
                    <div>
                        {servicos.map(servico => (
                            <button
                                type="button"
                                key={servico.id}
                                className="btn btn-secondary btn-sm me-2 mb-2"
                                onClick={() => handleAdicionarItem('servico', servico.id)}
                            >
                                {servico.nome}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Itens da Compra:</label>
                    <ul className="list-group">
                        {itensCompra.map((item, index) => {
                            const produtoOuServico = item.tipo === 'produto'
                                ? produtos.find(prod => prod.id === item.id)
                                : servicos.find(serv => serv.id === item.id);

                            return produtoOuServico ? (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {produtoOuServico.nome} - {item.tipo === 'produto' ? 'Produto' : 'Serviço'}
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantidade}
                                        onChange={(e) => handleQuantidadeChange(index, parseInt(e.target.value))}
                                        className="form-control ms-3"
                                        style={{ width: '80px' }}
                                    />
                                </li>
                            ) : null;
                        })}
                    </ul>
                </div>

                <div className="mb-3">
                    <h5>Valor Total: R$ {valorTotal.toFixed(2)}</h5>
                </div>

                <button type="submit" className="btn btn-primary w-100">Cadastrar Compra</button>
            </form>
        </div>
    );
};

export default CadastroCompra;
