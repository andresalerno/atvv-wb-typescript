import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para ListagemCliente
type ListagemClienteProps = {
    clientes: any[];
    setClientes: React.Dispatch<React.SetStateAction<any[]>>;
};

const ListagemCliente: React.FC<ListagemClienteProps> = ({ clientes, setClientes }) => {
    const navigate = useNavigate();

    const handleExcluir = (id: number) => {
        const novosClientes = clientes.filter(cliente => cliente.id !== id);
        setClientes(novosClientes);
    };

    const handleEditar = (id: number) => {
        navigate(`/editar-cliente/${id}`);
    };

    const handleVoltar = () => {
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Listagem de Clientes</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nome Social</th>
                        <th>CPF</th>
                        <th>Data de Emissão</th>
                        <th>Gênero</th>
                        <th className="text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.nomeSocial || '-'}</td>
                                <td>{cliente.cpf}</td>
                                <td>{new Date(cliente.dataEmissao).toLocaleDateString()}</td>
                                <td>{cliente.genero}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEditar(cliente.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleExcluir(cliente.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">Nenhum cliente cadastrado.</td>
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

export default ListagemCliente;
