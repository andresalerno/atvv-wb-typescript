import React from 'react';
import { useNavigate } from 'react-router-dom';

type ExclusaoProdutoProps = {
    id: number;
    produtos: any[];
    setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
};

const ExclusaoProduto: React.FC<ExclusaoProdutoProps> = ({ id, produtos, setProdutos }) => {
    const navigate = useNavigate();

    const handleExcluir = () => {
        const novosProdutos = produtos.filter(produto => produto.id !== id);
        setProdutos(novosProdutos);
        alert('Produto excluído com sucesso!');
        navigate('/produtos');
    };

    const handleCancelar = () => {
        navigate('/produtos');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Excluir Produto</h2>
            <p>Tem certeza que deseja excluir o produto com ID {id}?</p>
            <button className="btn btn-danger me-2" onClick={handleExcluir}>
                Confirmar Exclusão
            </button>
            <button className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
            </button>
        </div>
    );
};

export default ExclusaoProduto;
