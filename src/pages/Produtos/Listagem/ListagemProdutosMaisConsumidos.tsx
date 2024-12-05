import React from 'react';

type ListagemProdutosMaisConsumidosProps = {
    compras: any[];
};

type ProdutoConsumo = {
    id: number;
    nome: string;
    quantidadeTotal: number;
};

const ListagemProdutosMaisConsumidos: React.FC<ListagemProdutosMaisConsumidosProps> = ({ compras }) => {
    const calcularProdutosMaisConsumidos = (): ProdutoConsumo[] => {
        const produtosConsumo: { [key: number]: ProdutoConsumo } = {};

        compras.forEach(compra => {
            compra.produtos.forEach((produto: any) => {
                if (!produtosConsumo[produto.id]) {
                    produtosConsumo[produto.id] = {
                        id: produto.id,
                        nome: produto.nome,
                        quantidadeTotal: 0,
                    };
                }
                produtosConsumo[produto.id].quantidadeTotal += produto.quantidade;
            });
        });

        return Object.values(produtosConsumo).sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);
    };

    const produtosMaisConsumidos = calcularProdutosMaisConsumidos();

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Produtos Mais Consumidos</h2>
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>ID</th>
                        <th>Nome do Produto</th>
                        <th>Quantidade Total Consumida</th>
                    </tr>
                </thead>
                <tbody>
                    {produtosMaisConsumidos.length > 0 ? (
                        produtosMaisConsumidos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.id}</td>
                                <td>{produto.nome}</td>
                                <td>{produto.quantidadeTotal}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center">Nenhum produto foi consumido.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListagemProdutosMaisConsumidos;
