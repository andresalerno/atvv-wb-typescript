import React from 'react';
import { useNavigate } from 'react-router-dom';

type ListagemProdutoProps = {
    produtos: any[];
    setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
};

const ListagemProduto: React.FC<ListagemProdutoProps> = ({ produtos, setProdutos }) => {
    const navigate = useNavigate();

    const handleExcluir = (id: number) => {
        const novosProdutos = produtos.filter(produto => produto.id !== id);
        setProdutos(novosProdutos);
    };

    const handleEditar = (id: number) => {
        navigate(`/editar-produto/${id}`);
    };

    const handleVoltar = () => {
        navigate('/');
    };

    const formatarPreco = (preco: number): string => {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Listagem de Produtos</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th className="text-center">Preço</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.length > 0 ? (
                        produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td className="text-center">{formatarPreco(produto.preco)}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEditar(produto.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleExcluir(produto.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">Nenhum produto cadastrado.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-secondary" onClick={handleVoltar}>
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default ListagemProduto;
