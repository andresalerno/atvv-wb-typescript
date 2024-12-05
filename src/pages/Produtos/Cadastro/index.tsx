import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type CadastroProdutoProps = {
    produtos: any[];
    setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
};

const CadastroProduto: React.FC<CadastroProdutoProps> = ({ produtos, setProdutos }) => {
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

    const handleCadastrar = (e: React.FormEvent) => {
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

        // Criação do produto e atualização da lista de produtos
        const idProduto = produtos.length + 1;
        const novoProduto = {
            id: idProduto,
            nome,
            preco: precoNumerico,
        };
        setProdutos([...produtos, novoProduto]);

        alert('Produto cadastrado com sucesso!');
        navigate('/produtos'); // Redireciona para a listagem de produtos
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
                <button type="submit" className="btn btn-primary w-100">Cadastrar Produto</button>
                <button type="button" className="btn btn-secondary mt-3 w-100" onClick={handleVoltar}>Voltar</button>
            </form>
        </div>
    );
};

export default CadastroProduto;
