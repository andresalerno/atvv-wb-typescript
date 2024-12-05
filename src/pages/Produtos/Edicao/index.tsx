import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EdicaoProdutoProps {
    produtos: any[];
    setProdutos: React.Dispatch<React.SetStateAction<any[]>>;
}

const EdicaoProduto: React.FC<EdicaoProdutoProps> = ({ produtos, setProdutos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const produto = produtos.find(produto => produto.id === parseInt(id || '', 10));
        if (produto) {
            setNome(produto.nome);
            setPreco(produto.preco.toString());
        }
    }, [id, produtos]);

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

        // Atualização do produto
        const novosProdutos = produtos.map(produto =>
            produto.id === parseInt(id || '', 10)
                ? { ...produto, nome, preco: precoNumerico }
                : produto
        );
        setProdutos(novosProdutos);

        alert('Produto editado com sucesso!');
        navigate('/produtos');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edição de Produto</h2>
            <form onSubmit={handleEditar} className="needs-validation" noValidate>
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
                    <div className="invalid-feedback">Por favor, insira um nome válido.</div>
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
                    <div className="invalid-feedback">Por favor, insira um preço válido.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoProduto;
