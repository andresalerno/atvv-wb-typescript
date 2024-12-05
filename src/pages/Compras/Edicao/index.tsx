import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface EdicaoCompraProps {
    compras: any[];
    setCompras: React.Dispatch<React.SetStateAction<any[]>>;
    clientes: any[];
    produtos: any[];
    servicos: any[];
}

const EdicaoCompra: React.FC<EdicaoCompraProps> = ({ compras, setCompras, clientes, produtos, servicos }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [clienteId, setClienteId] = useState<number>(0);
    const [produtosSelecionados, setProdutosSelecionados] = useState<{ id: number; quantidade: number }[]>([]);
    const [servicosSelecionados, setServicosSelecionados] = useState<{ id: number; quantidade: number }[]>([]);

    useEffect(() => {
        const compra = compras.find(compra => compra.id === parseInt(id || '', 10));
        if (compra) {
            setClienteId(compra.cliente.id);
            setProdutosSelecionados(
                compra.produtos.map((produto: any) => ({
                    id: produto.id,
                    quantidade: produto.quantidade,
                }))
            );
            setServicosSelecionados(
                compra.servicos.map((servico: any) => ({
                    id: servico.id,
                    quantidade: servico.quantidade,
                }))
            );
        }
    }, [id, compras]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setClienteId(parseInt(event.target.value, 10));
    };

    const handleQuantidadeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        tipo: 'produto' | 'servico',
        itemId: number
    ) => {
        const quantidade = parseInt(event.target.value, 10);

        if (tipo === 'produto') {
            setProdutosSelecionados(prev =>
                prev.map(produto => (produto.id === itemId ? { ...produto, quantidade } : produto))
            );
        } else if (tipo === 'servico') {
            setServicosSelecionados(prev =>
                prev.map(servico => (servico.id === itemId ? { ...servico, quantidade } : servico))
            );
        }
    };

    const handleEditar = (e: React.FormEvent) => {
        e.preventDefault();

        if (clienteId === 0) {
            alert('Por favor, selecione um cliente.');
            return;
        }

        if (produtosSelecionados.length === 0 && servicosSelecionados.length === 0) {
            alert('Por favor, selecione pelo menos um produto ou serviço.');
            return;
        }

        const novasCompras = compras.map(compra =>
            compra.id === parseInt(id || '', 10)
                ? { ...compra, clienteId, produtos: produtosSelecionados, servicos: servicosSelecionados }
                : compra
        );

        setCompras(novasCompras);
        alert('Compra editada com sucesso!');
        navigate('/compras');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edição de Compra</h2>
            <form onSubmit={handleEditar}>
                <div className="mb-3">
                    <label className="form-label">(*) Cliente:</label>
                    <select
                        name="clienteId"
                        value={clienteId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value={0}>Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <h5>Produtos:</h5>
                    {produtos.map(produto => (
                        <div key={produto.id} className="d-flex align-items-center mb-2">
                            <label className="me-3">{produto.nome}:</label>
                            <input
                                type="number"
                                min={0}
                                className="form-control w-25"
                                value={
                                    produtosSelecionados.find(p => p.id === produto.id)?.quantidade || 0
                                }
                                onChange={(e) => handleQuantidadeChange(e, 'produto', produto.id)}
                            />
                        </div>
                    ))}
                </div>
                <div className="mb-3">
                    <h5>Serviços:</h5>
                    {servicos.map(servico => (
                        <div key={servico.id} className="d-flex align-items-center mb-2">
                            <label className="me-3">{servico.nome}:</label>
                            <input
                                type="number"
                                min={0}
                                className="form-control w-25"
                                value={
                                    servicosSelecionados.find(s => s.id === servico.id)?.quantidade || 0
                                }
                                onChange={(e) => handleQuantidadeChange(e, 'servico', servico.id)}
                            />
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoCompra;
