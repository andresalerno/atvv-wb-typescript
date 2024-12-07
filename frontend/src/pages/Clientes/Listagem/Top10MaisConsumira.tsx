import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para Top10MaisConsumiram
type Top10MaisConsumiramProps = {
    clientes: any[];
    compras: any[];
};

const Top10MaisConsumiram: React.FC<Top10MaisConsumiramProps> = ({ clientes, compras }) => {
    const navigate = useNavigate();

    const handleVerDetalhes = (clienteId: number) => {
        navigate(`/clientes/${clienteId}/detalhes`);
    };

    const handleVoltar = () => {
        navigate('/');
    };

    const obterTop10Clientes = () => {
        // Calcular o total consumido por cada cliente
        const clientesComTotalConsumido = clientes.map(cliente => {
            const totalConsumido = compras
                .filter(compra => compra.clienteId === cliente.id)
                .reduce((acc: number, compra: any) => {
                    const totalProdutos = compra.produtos.reduce((total: number, produto: any) => total + (produto.preco * produto.quantidade), 0);
                    const totalServicos = compra.servicos.reduce((total: number, servico: any) => total + (servico.preco * servico.quantidade), 0);
                    return acc + totalProdutos + totalServicos;
                }, 0);
            return { ...cliente, totalConsumido };
        });

        // Ordenar os clientes pelo valor total consumido e pegar os 10 primeiros
        return clientesComTotalConsumido
            .sort((a, b) => b.totalConsumido - a.totalConsumido) // Ordena de forma decrescente
            .slice(0, 10); // Pega os 10 primeiros
    };

    const top10Clientes = obterTop10Clientes();

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Top 10 Clientes que Mais Consumiram</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nome Social</th>
                        <th>CPF</th>
                        <th>Total Consumido</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {top10Clientes.length > 0 ? (
                        top10Clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.nomeSocial || '-'}</td>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.totalConsumido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => handleVerDetalhes(cliente.id)}
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Nenhum cliente encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-secondary" onClick={handleVoltar}>Voltar</button>
            </div>
        </div>
    );
};

export default Top10MaisConsumiram;
