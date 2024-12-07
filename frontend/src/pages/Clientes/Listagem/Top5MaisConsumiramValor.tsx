import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para Top5MaisConsumiramValor
type Top5MaisConsumiramValorProps = {
    clientes: any[];
};

const Top5MaisConsumiramValor: React.FC<Top5MaisConsumiramValorProps> = ({ clientes }) => {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate('/');
    };

    // Adicione valorConsumido se não existir para evitar problemas
    const clientesComValor = clientes.map(cliente => ({
        ...cliente,
        valorConsumido: cliente.valorConsumido || 0, // Define valorConsumido como 0 se não existir
    }));

    // Ordena os clientes pelo valor total consumido e seleciona os 5 maiores
    const clientesOrdenados = [...clientesComValor].sort((a, b) => b.valorConsumido - a.valorConsumido);
    const top5Clientes = clientesOrdenados.slice(0, 5);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Top 5 Clientes que Mais Consumiram em Valor</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nome Social</th>
                        <th>CPF</th>
                        <th>Gênero</th>
                        <th>Valor Total Consumido</th>
                    </tr>
                </thead>
                <tbody>
                    {top5Clientes.length > 0 ? (
                        top5Clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.nomeSocial || '-'}</td>
                                <td>{cliente.cpf}</td>
                                <td>{cliente.genero}</td>
                                <td>{cliente.valorConsumido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Nenhum cliente encontrado.</td>
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

export default Top5MaisConsumiramValor;
