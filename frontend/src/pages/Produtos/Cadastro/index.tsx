import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type CadastroProdutoProps = {
    produtos: any[];
    setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
};

const CadastroProduto: React.FC<CadastroProdutoProps> = ({ produtos, setProdutos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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

        setIsLoading(true);

        try {
            // Enviar dados ao backend
            const response = await axios.post('http://localhost:5000/produtos', {
                nome,
                preco: precoNumerico,
            });

            if (response.status === 201) {
                // Atualizar a lista de produtos localmente
                setProdutos([...produtos, response.data]);

                alert('Produto cadastrado com sucesso!');
                navigate('/produtos'); // Redirecionar para a listagem de produtos
            }
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            alert('Ocorreu um erro ao cadastrar o produto. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVoltar = () => {
        navigate('/produtos');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Produto</h2>
            <form onSubmit={handleCadastrar} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">(*) Nome do Produto:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do produto"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Preço do Produto:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="preco"
                        value={preco}
                        onChange={handleChange}
                        placeholder="Digite o preço do produto"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                    {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
                </button>
                <button type="button" className="btn btn-secondary mt-3 w-100" onClick={handleVoltar}>
                    Voltar
                </button>
            </form>
        </div>
    );
};

export default CadastroProduto;
