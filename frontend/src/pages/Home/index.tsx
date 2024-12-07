import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    const toggleSubmenu = (card: string) => {
        setExpandedCard(prevCard => (prevCard === card ? null : card));
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Gerenciamento</h2>
            <div className="row">
                {/* Gerenciar Clientes */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div
                        className="card"
                        onClick={() => toggleSubmenu('clientes')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Gerenciar Clientes</h5>
                        </div>
                    </div>
                    {expandedCard === 'clientes' && (
                        <div className="list-group">
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/cadastrar-cliente')}
                            >
                                Cadastrar Clientes
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/clientes')}
                            >
                                Listagem de Clientes
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/clientes/top10-mais')}
                            >
                                Top 10 Mais Consumiram
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/clientes/top10-menos')}
                            >
                                Top 10 Menos Consumiram
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/clientes/top5-valor')}
                            >
                                Top 5 Mais Consumiram em Valor
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/clientes/genero')}
                            >
                                Listar por Gênero
                            </button>
                        </div>
                    )}
                </div>

                {/* Gerenciar Produtos */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div
                        className="card"
                        onClick={() => toggleSubmenu('produtos')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Gerenciar Produtos</h5>
                        </div>
                    </div>
                    {expandedCard === 'produtos' && (
                        <div className="list-group">
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/cadastrar-produto')}
                            >
                                Cadastrar Produtos
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/produtos')}
                            >
                                Listagem de Produtos
                            </button>
                        </div>
                    )}
                </div>

                {/* Gerenciar Serviços */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div
                        className="card"
                        onClick={() => toggleSubmenu('servicos')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Gerenciar Serviços</h5>
                        </div>
                    </div>
                    {expandedCard === 'servicos' && (
                        <div className="list-group">
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/cadastrar-servico')}
                            >
                                Cadastrar Serviços
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/servicos')}
                            >
                                Listagem de Serviços
                            </button>
                        </div>
                    )}
                </div>

                {/* Gerenciar Compras */}
                <div className="col-md-6 col-lg-3 mb-4">
                    <div
                        className="card"
                        onClick={() => toggleSubmenu('compras')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-body text-center">
                            <h5 className="card-title">Gerenciar Compras</h5>
                        </div>
                    </div>
                    {expandedCard === 'compras' && (
                        <div className="list-group">
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/cadastrar-compra')}
                            >
                                Cadastrar Compra
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/compras')}
                            >
                                Listar Compras
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/compras/produtos-mais-consumidos')}
                            >
                                Listar Produtos Mais Consumidos
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/compras/servicos-mais-consumidos')}
                            >
                                Listar Serviços Mais Consumidos
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/compras/produtos-por-genero')}
                            >
                                Listar Produtos Mais Consumidos por Gênero
                            </button>
                            <button
                                className="list-group-item list-group-item-action"
                                onClick={() => handleNavigate('/compras/servicos-por-genero')}
                            >
                                Listar Serviços Mais Consumidos por Gênero
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
