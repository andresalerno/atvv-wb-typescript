import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type CadastroServicoProps = {
    servicos: any[];
    setServicos: React.Dispatch<React.SetStateAction<any[]>>;
};

const CadastroServico: React.FC<CadastroServicoProps> = ({ servicos, setServicos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'nome') {
            setNome(value);
        } else if (name === 'preco') {
            setPreco(value);
        }
    };

    const handleCadastrar = async (e: React.FormEvent) => {
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

        try {
            // Enviar dados ao backend
            const response = await axios.post('http://localhost:5000/servicos', {
                nome,
                preco: precoNumerico,
            });

            // Atualizar estado local com o novo serviço
            setServicos([...servicos, response.data]);

            alert('Serviço cadastrado com sucesso!');

            // Redirecionar para a listagem de serviços
            navigate('/servicos');
        } catch (error) {
            console.error('Erro ao cadastrar serviço:', error);
            alert('Não foi possível cadastrar o serviço. Tente novamente.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Serviço</h2>
            <form onSubmit={handleCadastrar} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">(*) Descrição do Serviço:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={nome}
                        onChange={handleChange}
                        placeholder="Digite a descrição do serviço"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira uma descrição válida.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Preço do Serviço:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="preco"
                        value={preco}
                        onChange={handleChange}
                        placeholder="Digite o preço do serviço"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira um preço válido.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Cadastrar Serviço</button>
            </form>
        </div>
    );
};

export default CadastroServico;
