import React from 'react';
import { useNavigate } from 'react-router-dom';

type ListagemServicoProps = {
    servicos: any[];
    setServicos: React.Dispatch<React.SetStateAction<any[]>>;
};

const ListagemServico: React.FC<ListagemServicoProps> = ({ servicos, setServicos }) => {
    const navigate = useNavigate();

    const handleExcluir = (id: number) => {
        const novosServicos = servicos.filter(servico => servico.id !== id);
        setServicos(novosServicos);
    };

    const handleEditar = (id: number) => {
        navigate(`/editar-servico/${id}`);
    };

    const handleVoltar = () => {
        navigate('/');
    };

    const formatarPreco = (preco: number): string => {
        return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Listagem de Serviços</h2>
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
                    {servicos.length > 0 ? (
                        servicos.map(servico => (
                            <tr key={servico.id}>
                                <td>{servico.id}</td>
                                <td>{servico.nome}</td>
                                <td className="text-center">{formatarPreco(servico.preco)}</td>
                                <td className="text-center">
                                    <button
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEditar(servico.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleExcluir(servico.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">Nenhum serviço cadastrado.</td>
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

export default ListagemServico;
