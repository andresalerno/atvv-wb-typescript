import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Tipo de Props para ExclusaoCliente
type ExclusaoClienteProps = {
    clientes: any[];
    setClientes: React.Dispatch<React.SetStateAction<any[]>>;
};

const ExclusaoCliente: React.FC<ExclusaoClienteProps> = ({ clientes, setClientes }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleExcluir = () => {
        if (id) {
            const clienteId = parseInt(id, 10);
            const novosClientes = clientes.filter(cliente => cliente.id !== clienteId);
            setClientes(novosClientes);
            alert('Cliente excluído com sucesso!');
            navigate('/clientes');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Excluir Cliente</h2>
            <p>Tem certeza que deseja excluir o cliente com ID {id}?</p>
            <button className="btn btn-danger me-2" onClick={handleExcluir}>
                Confirmar Exclusão
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>
                Cancelar
            </button>
        </div>
    );
};

export default ExclusaoCliente;
