import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type DetalhesCompraProps = {
    compras: any[];
};

const DetalhesCompra: React.FC<DetalhesCompraProps> = ({ compras }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleVoltar = () => {
        navigate('/compras');
    };

    const calcularTotal = (compra: any): number => {
        let total = 0;

        const produtos = compra.produtos || [];
        const servicos = compra.servicos || [];

        produtos.forEach((produto: any) => {
            total += produto.preco * (produto.quantidade || 1);
        });

        servicos.forEach((servico: any) => {
            total += servico.preco * (servico.quantidade || 1);
        });

        return total;
    };

    const formatarPreco = (preco: number): string => {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const compra = compras.find((compra) => compra.id === parseInt(id || '', 10));

    if (!compra) {
        return <div className="container mt-5">Compra não encontrada.</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Detalhes da Compra #{compra.id}</h2>
            <h4>Cliente: {compra.clienteNome}</h4>
            <h5>Data da Compra: {new Date(compra.data).toLocaleDateString('pt-BR')}</h5>

            <div className="mt-4">
                <h5>Produtos:</h5>
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Valor Unitário</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compra.produtos.map((produto: any, index: number) => (
                            <tr key={index}>
                                <td>{produto.nome}</td>
                                <td>{produto.quantidade}</td>
                                <td>{formatarPreco(produto.preco)}</td>
                                <td>{formatarPreco(produto.preco * produto.quantidade)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <h5>Serviços:</h5>
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Valor Unitário</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compra.servicos.map((servico: any, index: number) => (
                            <tr key={index}>
                                <td>{servico.nome}</td>
                                <td>{servico.quantidade}</td>
                                <td>{formatarPreco(servico.preco)}</td>
                                <td>{formatarPreco(servico.preco * servico.quantidade)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <h4>Total: {formatarPreco(calcularTotal(compra))}</h4>
            </div>

            <button className="btn btn-secondary mt-4" onClick={handleVoltar}>
                Voltar
            </button>
        </div>
    );
};

export default DetalhesCompra;
