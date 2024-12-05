import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

type BarraNavegacaoProps = {
    tema?: string;
    botoes: { texto: string; rota: string; icone: string, submenus?: { texto: string; rota: string }[] }[];
};

const BarraNavegacao: React.FC<BarraNavegacaoProps> = ({ tema = 'navbar-dark bg-primary', botoes }) => {
    const navigate = useNavigate();

    const gerarListaBotoes = () => {
        return botoes.map((botao) => (
            <li key={botao.texto} className="nav-item">
                <a
                    className="nav-link"
                    onClick={() => navigate(botao.rota)}
                    style={{ cursor: 'pointer', color: '#ffffff' }}
                >
                    <i className={`bi bi-${botao.icone}`}></i> {botao.texto}
                </a>
            </li>
        ));
    };

    return (
        <nav className={`navbar navbar-expand-lg ${tema}`}>
            <div className="container-fluid">
                <a
                    className="navbar-brand"
                    onClick={() => navigate('/')}
                    style={{ cursor: 'pointer', color: '#ffffff' }}
                >
                    World Beauty
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {gerarListaBotoes()}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default BarraNavegacao;
