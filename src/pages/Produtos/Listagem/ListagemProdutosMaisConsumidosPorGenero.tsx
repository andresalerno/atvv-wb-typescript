import React from 'react';

type ListagemProdutosMaisConsumidosPorGeneroProps = {
    clientes: any[];
    compras: any[];
};

type ConsumoPorGenero = {
    [genero: string]: {
        [produtoNome: string]: number;
    };
};

const ListagemProdutosMaisConsumidosPorGenero: React.FC<ListagemProdutosMaisConsumidosPorGeneroProps> = ({ clientes, compras }) => {
    const calcularProdutosMaisConsumidosPorGenero = (): ConsumoPorGenero => {
        const consumoPorGenero: ConsumoPorGenero = {};

        compras.forEach((compra) => {
            const cliente = clientes.find((c) => c.id === compra.clienteId);
            if (cliente) {
                const genero = cliente.genero;
                if (!consumoPorGenero[genero]) {
                    consumoPorGenero[genero] = {};
                }

                compra.produtos.forEach((produto: any) => {
                    if (!consumoPorGenero[genero][produto.nome]) {
                        consumoPorGenero[genero][produto.nome] = 0;
                    }
                    consumoPorGenero[genero][produto.nome] += produto.quantidade;
                });
            }
        });

        return consumoPorGenero;
    };

    const consumoPorGenero = calcularProdutosMaisConsumidosPorGenero();

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Produtos Mais Consumidos por Gênero</h2>
            {Object.keys(consumoPorGenero).map((genero) => (
                <div key={genero} className="mb-4">
                    <h4>{genero}</h4>
                    <table className="table table-bordered">
                        <thead className="table-light">
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade Consumida</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(consumoPorGenero[genero])
                                .sort((a, b) => b[1] - a[1])
                                .map(([produtoNome, quantidade]) => (
                                    <tr key={produtoNome}>
                                        <td>{produtoNome}</td>
                                        <td>{quantidade}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ListagemProdutosMaisConsumidosPorGenero;
