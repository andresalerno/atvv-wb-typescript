import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Servico = {
    id: number;
    nome: string;
    preco: number;
};

type ListagemServicoProps = {
    servicos: Servico[];
    setServicos: React.Dispatch<React.SetStateAction<Servico[]>>;
};

const ListagemServico: React.FC<ListagemServicoProps> = ({ servicos, setServicos }) => {
    const navigate = useNavigate();

    // Função para buscar serviços do backend
    const buscarServicos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/servicos');
            setServicos(response.data); // Atualiza o estado com os serviços retornados do backend
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
            alert('Não foi possível carregar os serviços. Tente novamente mais tarde.');
        }
    };

    // Carregar os serviços ao montar o componente
    useEffect(() => {
        buscarServicos();
    }, []);

    const handleExcluir = async (id: number) => {
        if (!window.confirm('Tem certeza de que deseja excluir este serviço?')) {
            return;
        }

        try {
            // Excluir serviço no backend
            await axios.delete(`http://localhost:5000/servicos/${id}`);
            
            // Atualizar o estado local removendo o serviço excluído
            setServicos(servicos.filter(servico => servico.id !== id));

            alert('Serviço excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            alert('Não foi possível excluir o serviço. Tente novamente.');
        }
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
