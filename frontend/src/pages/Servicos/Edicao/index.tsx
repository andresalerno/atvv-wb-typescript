import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Servico {
    id: number;
    nome: string;
    preco: number;
}

interface EdicaoServicoProps {
    servicos: Servico[];
    setServicos: React.Dispatch<React.SetStateAction<Servico[]>>;
}

const EdicaoServico: React.FC<EdicaoServicoProps> = ({ servicos, setServicos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const servico = servicos.find(servico => servico.id === parseInt(id || '', 10));
        if (servico) {
            setNome(servico.nome);
            setPreco(servico.preco.toString());
        } else {
            // Buscar serviço diretamente do backend, caso não esteja no estado local
            const fetchServico = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/servicos/${id}`);
                    setNome(response.data.nome);
                    setPreco(response.data.preco.toString());
                } catch (error) {
                    console.error('Erro ao buscar serviço:', error);
                    alert('Serviço não encontrado!');
                    navigate('/servicos');
                }
            };
            fetchServico();
        }
    }, [id, servicos, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === 'nome') {
            setNome(value);
        } else if (name === 'preco') {
            setPreco(value);
        }
    };

    const handleEditar = async (e: React.FormEvent) => {
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
            // Enviar atualização ao backend
            const response = await axios.put(`http://localhost:5000/servicos/${id}`, {
                nome,
                preco: precoNumerico,
            });

            // Atualizar o estado local com o serviço atualizado
            const servicoAtualizado = response.data;
            const novosServicos = servicos.map(servico =>
                servico.id === servicoAtualizado.id ? servicoAtualizado : servico
            );
            setServicos(novosServicos);

            alert('Serviço editado com sucesso!');
            navigate('/servicos'); // Redireciona para a listagem de serviços
        } catch (error) {
            console.error('Erro ao editar serviço:', error);
            alert('Não foi possível editar o serviço. Tente novamente.');
        }
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
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoServico;
