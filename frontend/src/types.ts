// src/types.ts

export interface Cliente {
    id: number;
    nome: string;
    cpfValor: string; // CPF como string
    cpfDataEmissao: string; // Data de emissão do CPF
    genero: string; // Gênero do cliente
    valorConsumido?: number; // Valor consumido, opcional
}

export interface Produto {
    id: number;
    nome: string;
    preco: number; // Preço do produto
}

export interface Servico {
    id: number;
    nome: string;
    preco: number; // Preço do serviço
}

export interface Compra {
    id: number;
    clienteId: number;
    itensCompra: {
        tipo: 'produto' | 'servico';
        id: number;
        quantidade: number;
    }[];
    total: number;
}
