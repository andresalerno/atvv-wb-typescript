import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Produto {
    id: number;
    nome: string;
    preco: number;
}

interface EdicaoProdutoProps {
    produtos: Produto[];
    setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
}

const EdicaoProduto: React.FC<EdicaoProdutoProps> = ({ produtos, setProdutos }) => {
    const [nome, setNome] = useState<string>('');
    const [preco, setPreco] = useState<string>('');
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const produto = produtos.find(produto => produto.id === parseInt(id || '', 10));
        if (produto) {
            setNome(produto.nome);
            setPreco(produto.preco.toString());
        } else {
            alert('Produto não encontrado!');
            navigate('/produtos');
        }
    }, [id, produtos, navigate]);

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
            const response = await axios.put(`http://localhost:5000/produtos/${id}`, {
                nome,
                preco: precoNumerico,
            });

            // Atualizar estado local com o produto atualizado
            const produtoAtualizado = response.data;
            const novosProdutos = produtos.map(produto =>
                produto.id === produtoAtualizado.id ? produtoAtualizado : produto
            );
            setProdutos(novosProdutos);

            alert('Produto editado com sucesso!');
            navigate('/produtos'); // Redireciona para a listagem de produtos
        } catch (error) {
            console.error('Erro ao editar produto:', error);
            alert('Não foi possível editar o produto. Tente novamente.');
        }
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
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Preço do Produto:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="preco"
                        value={preco}
                        onChange={handleChange}
                        placeholder="Digite o preço do produto"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoProduto;
