import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para ListagemGenero
type ListagemGeneroProps = {
  clientes: any[];
  setClientes: React.Dispatch<React.SetStateAction<any[]>>;
};

const ListagemGenero: React.FC<ListagemGeneroProps> = ({ clientes, setClientes }) => {
  const [generoSelecionado, setGeneroSelecionado] = useState<string>('');
  const navigate = useNavigate();

  const fetchClientes = async (genero:string) => {
    try {
      const response = await fetch(`http://localhost:5000/clientes/genero/${genero}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };


  const handleGeneroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGeneroSelecionado(event.target.value);
    fetchClientes(event.target.value)
  };

  const handleVoltar = () => {
    navigate('/');
  };

  const clientesFiltrados = generoSelecionado
    ? clientes.filter((cliente) => cliente.genero === generoSelecionado)
    : clientes;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Listagem de Clientes por Gênero</h2>
      <div className="mb-3">
        <label className="form-label">Selecione o Gênero:</label>
        <select
          className="form-select"
          value={generoSelecionado}
          onChange={handleGeneroChange}
        >
          <option value="">Todos</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
          <option value="Não declarar">Não declarar</option>
        </select>
      </div>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Nome Social</th>
            <th>CPF</th>
            <th>Data de Emissão</th>
            <th>Gênero</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.nomeSocial || '-'}</td>
                <td>{cliente.cpf}</td>
                <td>{new Date(cliente.dataEmissao).toLocaleDateString()}</td>
                <td>{cliente.genero}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                Nenhum cliente encontrado para o gênero selecionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-secondary" onClick={handleVoltar}>
          Voltar
        </button>
      </div>
    </div>
  );
};

export default ListagemGenero;
