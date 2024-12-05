import React from 'react';
import { useNavigate } from 'react-router-dom';

type ExclusaoCompraProps = {
    id: number;
    compras: any[];
    setCompras: React.Dispatch<React.SetStateAction<any[]>>;
};

const ExclusaoCompra: React.FC<ExclusaoCompraProps> = ({ id, compras, setCompras }) => {
    const navigate = useNavigate();

    const handleExcluir = () => {
        const novasCompras = compras.filter(compra => compra.id !== id);
        setCompras(novasCompras);
        alert('Compra excluída com sucesso!');
        navigate('/compras');
    };

    const handleCancelar = () => {
        navigate('/compras');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Excluir Compra</h2>
            <p>Tem certeza que deseja excluir a compra com ID {id}?</p>
            <button className="btn btn-danger me-2" onClick={handleExcluir}>
                Confirmar Exclusão
            </button>
            <button className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
            </button>
        </div>
    );
};

export default ExclusaoCompra;
