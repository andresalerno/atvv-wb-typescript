import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EdicaoServicoProps {
    servicos: any[];
    setServicos: React.Dispatch<React.SetStateAction<any[]>>;
}

const EdicaoServico: React.FC<EdicaoServicoProps> = ({ servicos, setServicos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const servico = servicos.find(servico => servico.id === parseInt(id || '', 10));
        if (servico) {
            setNome(servico.nome);
            setPreco(servico.preco.toString());
        }
    }, [id, servicos]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'nome') {
            setNome(value);
        } else if (name === 'preco') {
            setPreco(value);
        }
    };

    const handleEditar = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação dos campos obrigatórios
        if (!nome.trim() || !preco.trim()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação do preço
        const precoNumerico = parseFloat(preco);
        if (isNaN(precoNumerico) || precoNumerico <= 0) {
            alert('Por favor, insira um preço válido.');
            return;
        }

        // Atualização do serviço
        const novosServicos = servicos.map(servico =>
            servico.id === parseInt(id || '', 10)
                ? { ...servico, nome, preco: precoNumerico }
                : servico
        );
        setServicos(novosServicos);

        alert('Serviço editado com sucesso!');
        navigate('/servicos');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edição de Serviço</h2>
            <form onSubmit={handleEditar} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">(*) Nome do Serviço:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do serviço"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira um nome válido.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Preço do Serviço:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="preco"
                        value={preco}
                        onChange={handleChange}
                        placeholder="Digite o preço do serviço"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira um preço válido.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoServico;
