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

        const itens = compra.itensDaCompra || [];

        itens.forEach((item: any) => {
            total += item.subtotal;
        });

        return total;
    };

    const formatarPreco = (preco: number): string => {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Encontrar a compra pelo ID
    const compra = compras.find((compra) => compra.id === parseInt(id || '', 10));

    if (!compra) {
        return <div className="container mt-5">Compra não encontrada.</div>;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Detalhes da Compra #{compra.id}</h2>
            <h4>Cliente: {compra.cliente?.nome || 'Cliente não encontrado'}</h4>
            <h5>Data da Compra: {new Date(compra.dataEvento).toLocaleDateString('pt-BR')}</h5>

            <div className="mt-4">
                <h5>Itens da Compra:</h5>
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
                        {compra.itensDaCompra.map((item: any, index: number) => {
                            const nome =
                                item.produtoAssociado?.nome || item.servicoAssociado?.nome || 'Item desconhecido';
                            const preco =
                                item.produtoAssociado?.preco || item.servicoAssociado?.preco || 0;

                            return (
                                <tr key={index}>
                                    <td>{nome}</td>
                                    <td>{item.quantidade}</td>
                                    <td>{formatarPreco(preco)}</td>
                                    <td>{formatarPreco(item.subtotal)}</td>
                                </tr>
                            );
                        })}
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
