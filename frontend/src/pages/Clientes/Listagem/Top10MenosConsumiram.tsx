import React from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para Top10MenosConsumiram
type Top10MenosConsumiramProps = {
    clientes: any[];
};

const Top10MenosConsumiram: React.FC<Top10MenosConsumiramProps> = ({ clientes }) => {
    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate('/');
    };

    const obterTop10MenosConsumiram = () => {
        // Ordenar clientes pelo consumo e pegar os 10 que menos consumiram
        return clientes
            .sort((a, b) => a.totalConsumido - b.totalConsumido)
            .slice(0, 10);
    };

    const top10Clientes = obterTop10MenosConsumiram();

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Top 10 Clientes que Menos Consumiram</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nome Social</th>
                        <th>CPF</th>
                        <th>Data de Emissão</th>
                        <th>Gênero</th>
                        <th>Total Consumido</th>
                    </tr>
                </thead>
                <tbody>
                    {top10Clientes.length > 0 ? (
                        top10Clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.id}</td>
                                <td>{cliente.nome}</td>
                                <td>{cliente.nomeSocial || '-'}</td>
                                <td>{cliente.cpf}</td>
                                <td>{new Date(cliente.dataEmissao).toLocaleDateString()}</td>
                                <td>{cliente.genero}</td>
                                <td>{cliente.totalConsumido ? cliente.totalConsumido.toFixed(2) : '0.00'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="text-center">Nenhum cliente encontrado.</td>
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

export default Top10MenosConsumiram;
