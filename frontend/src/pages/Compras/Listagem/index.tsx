import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Compra = {
  id: number;
  clienteId: number;
  dataEvento: string;
  totalGeral: number;
  cliente: {
    nome: string;
  };
  itensDaCompra: Array<{
    tipo: string;
    itemId: number;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    produtoAssociado?: { nome: string; preco: number };
    servicoAssociado?: { nome: string; preco: number };
  }>;
};

type ListagemComprasProps = {
  compras: Compra[];
  setCompras: React.Dispatch<React.SetStateAction<Compra[]>>;
};

const ListagemCompras: React.FC<ListagemComprasProps> = ({ compras, setCompras }) => {
  const navigate = useNavigate();

  const buscarCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5000/compras');
      console.log('Compras recebidas:', response.data); // Para debug
      setCompras(response.data);
    } catch (error) {
      console.error('Erro ao buscar compras:', error);
      alert('Não foi possível carregar as compras. Tente novamente mais tarde.');
    }
  };

  useEffect(() => {
    buscarCompras();
  }, []);

  const handleVerDetalhes = (id: number) => {
    navigate(`/detalhes-compra/${id}`);
  };

  const formatarPreco = (preco: number): string => {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Listagem de Compras</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data da Compra</th>
            <th className="text-center">Total</th>
            <th className="text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {compras.length > 0 ? (
            compras.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.cliente?.nome || 'Cliente não encontrado'}</td>
                <td>{new Date(compra.dataEvento).toLocaleDateString('pt-BR')}</td>
                <td className="text-center">{formatarPreco(compra.totalGeral)}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleVerDetalhes(compra.id)}
                  >
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Nenhuma compra realizada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemCompras;
