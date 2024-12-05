import React from 'react';
import { useNavigate } from 'react-router-dom';

type ExclusaoServicoProps = {
    id: number;
    servicos: any[];
    setServicos: React.Dispatch<React.SetStateAction<any[]>>;
};

const ExclusaoServico: React.FC<ExclusaoServicoProps> = ({ id, servicos, setServicos }) => {
    const navigate = useNavigate();

    const handleExcluir = () => {
        const novosServicos = servicos.filter(servico => servico.id !== id);
        setServicos(novosServicos);
        alert('Serviço excluído com sucesso!');
        navigate('/servicos');
    };

    const handleCancelar = () => {
        navigate('/servicos');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Excluir Serviço</h2>
            <p>Tem certeza que deseja excluir o serviço com ID {id}?</p>
            <button className="btn btn-danger me-2" onClick={handleExcluir}>
                Confirmar Exclusão
            </button>
            <button className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
            </button>
        </div>
    );
};

export default ExclusaoServico;
