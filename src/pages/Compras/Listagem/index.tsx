import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para ListagemCompras
type ListagemComprasProps = {
    compras: any[];
    clientes: any[];
};

const ListagemCompras: React.FC<ListagemComprasProps> = ({ compras, clientes }) => {
    const navigate = useNavigate();

    const handleVerDetalhes = (id: number) => {
        const compra = compras.find(c => c.id === id);
        if (!compra) {
            alert("Compra não encontrada!");
            return;
        }

        navigate(`/detalhes-compra/${id}`);
    };

    const handleVoltarParaHome = () => {
        navigate('/');
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

    const obterNomeCliente = (clienteId: number): string => {
        const cliente = clientes.find(cliente => cliente.id === clienteId);
        return cliente ? cliente.nome : 'Cliente não encontrado';
    };

    const valorTotalTodasCompras = compras.reduce((total, compra) => {
        return total + calcularTotal(compra);
    }, 0);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Listagem de Compras</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Data da Compra</th>
                        <th className="text-center">Total</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.length > 0 ? (
                        compras.map((compra, index) => (
                            <tr key={index}>
                                <td>{compra.id}</td>
                                <td>{obterNomeCliente(compra.clienteId)}</td>
                                <td>
                                    {compra.data ? new Date(compra.data).toLocaleDateString('pt-BR') : 'Data inválida'}
                                </td>
                                <td className="text-center">{formatarPreco(calcularTotal(compra))}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleVerDetalhes(compra.id)}
                                    >
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">Nenhuma compra realizada.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-4">
                <h5>Total de Todas as Compras: {formatarPreco(valorTotalTodasCompras)}</h5>
            </div>

            <div className="d-flex justify-content-end mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={handleVoltarParaHome}
                >
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default ListagemCompras;
