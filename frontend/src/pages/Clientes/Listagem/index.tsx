import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Tipo de Props para ListagemCliente
type Cliente = {
    id: number;
    nome: string;
    nomeSocial?: string;
    cpfValor: string;
    cpfDataEmissao: string;
    genero: string;
};

type ListagemClienteProps = {
    clientes: Cliente[];
    setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
};

const ListagemCliente: React.FC<ListagemClienteProps> = ({ clientes, setClientes }) => {
    const navigate = useNavigate();

    // Função para buscar clientes do backend
    const buscarClientes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/clientes');
            setClientes(response.data); // Atualiza o estado com os clientes retornados do backend
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            alert('Não foi possível carregar os clientes. Tente novamente mais tarde.');
        }
    };

    // Formatar a data no padrão dd/mm/aaaa
    const formatarData = (data: string): string => {
        const dataObjeto = new Date(data);
        const dia = dataObjeto.getDate().toString().padStart(2, '0');
        const mes = (dataObjeto.getMonth() + 1).toString().padStart(2, '0'); // Mês começa do 0
        const ano = dataObjeto.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };

    // Carregar os clientes ao montar o componente
    useEffect(() => {
        buscarClientes();
    }, []);

    const handleExcluir = async (id: number) => {
        if (!window.confirm('Tem certeza de que deseja excluir este cliente?')) {
            return;
        }

        try {
            // Excluir cliente no backend
            await axios.delete(`http://localhost:5000/clientes/${id}`);

            // Atualizar o estado local removendo o cliente excluído
            setClientes(clientes.filter(cliente => cliente.id !== id));

            alert('Cliente excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Não foi possível excluir o cliente. Tente novamente.');
        }
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
                                <td>{cliente.cpfValor}</td>
                                <td>{formatarData(cliente.cpfDataEmissao)}</td>
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
