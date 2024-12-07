import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Produto = {
    id: number;
    nome: string;
    preco: number;
};

type ListagemProdutoProps = {
    produtos: Produto[];
    setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
};

const ListagemProduto: React.FC<ListagemProdutoProps> = ({ produtos, setProdutos }) => {
    const navigate = useNavigate();

    // Função para buscar produtos do backend
    const buscarProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/produtos');
            setProdutos(response.data); // Atualiza o estado com os produtos recebidos
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            alert('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        }
    };

    // Carregar os produtos ao montar o componente
    useEffect(() => {
        buscarProdutos();
    }, []);

    const handleExcluir = async (id: number) => {
        if (!window.confirm('Tem certeza de que deseja excluir este produto?')) {
            return;
        }

        try {
            // Excluir produto no backend
            await axios.delete(`http://localhost:5000/produtos/${id}`);

            // Atualizar estado local sem rebuscar do backend
            setProdutos(produtos.filter((produto) => produto.id !== id));

            alert('Produto excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            alert('Não foi possível excluir o produto. Tente novamente.');
        }
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
                        produtos.map((produto) => (
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
