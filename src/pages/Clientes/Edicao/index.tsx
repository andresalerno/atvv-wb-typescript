import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Tipo de Props para EdicaoCliente
type EdicaoClienteProps = {
    clientes: any[];
    setClientes: React.Dispatch<React.SetStateAction<any[]>>;
};

const EdicaoCliente: React.FC<EdicaoClienteProps> = ({ clientes, setClientes }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [cliente, setCliente] = useState({
        id: 0,
        nome: '',
        nomeSocial: '',
        cpfValor: '',
        dataEmissao: '',
        generoOpcao: '1' as '1' | '2' | '3' | '4',
    });

    useEffect(() => {
        const clienteEncontrado = clientes.find((c) => c.id === parseInt(id || '', 10));
        if (clienteEncontrado) {
            setCliente({
                id: clienteEncontrado.id,
                nome: clienteEncontrado.nome || '',
                nomeSocial: clienteEncontrado.nomeSocial || '',
                cpfValor: clienteEncontrado.cpf || '',
                dataEmissao: new Date(clienteEncontrado.dataEmissao).toLocaleDateString('pt-BR'),
                generoOpcao: clienteEncontrado.generoOpcao || '1',
            });
        }
    }, [clientes, id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setCliente((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditar = (e: React.FormEvent) => {
        e.preventDefault();

        const { id, nome, cpfValor, dataEmissao, nomeSocial, generoOpcao } = cliente;

        // Validação dos campos obrigatórios
        if (!nome.trim() || !cpfValor.trim() || !dataEmissao.trim()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação da data
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataEmissao)) {
            alert('A data de emissão do CPF deve estar no formato dd/mm/aaaa.');
            return;
        }

        // Processamento da data
        const partes = dataEmissao.split('/');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const ano = parseInt(partes[2], 10);
        const dataEmissaoFormatada = new Date(ano, mes, dia);

        // Atualizar o cliente na lista de clientes
        const clientesAtualizados = clientes.map((clienteAtual) => {
            if (clienteAtual.id === id) {
                return {
                    ...clienteAtual,
                    nome,
                    nomeSocial,
                    cpf: cpfValor,
                    dataEmissao: dataEmissaoFormatada,
                    generoOpcao,
                };
            }
            return clienteAtual;
        });
        setClientes(clientesAtualizados);

        alert('Cliente editado com sucesso!');
        navigate('/clientes');  // Redireciona para a listagem de clientes
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edição de Cliente</h2>
            <form onSubmit={handleEditar} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">(*) Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={cliente.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do cliente"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira um nome válido.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Nome Social:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nomeSocial"
                        value={cliente.nomeSocial}
                        onChange={handleChange}
                        placeholder="Digite o nome social do cliente (opcional)"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) CPF:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cpfValor"
                        value={cliente.cpfValor}
                        onChange={handleChange}
                        placeholder="Digite o CPF do cliente"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira um CPF válido.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Data de Emissão do CPF (dd/mm/aaaa):</label>
                    <input
                        type="text"
                        className="form-control"
                        name="dataEmissao"
                        value={cliente.dataEmissao}
                        onChange={handleChange}
                        placeholder="Digite a data de emissão do CPF"
                        required
                    />
                    <div className="invalid-feedback">Por favor, insira uma data válida no formato dd/mm/aaaa.</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Gênero:</label>
                    <select
                        className="form-select"
                        name="generoOpcao"
                        value={cliente.generoOpcao}
                        onChange={handleChange}
                        required
                    >
                        <option value="1">Masculino</option>
                        <option value="2">Feminino</option>
                        <option value="3">Outro</option>
                        <option value="4">Não desejo declarar</option>
                    </select>
                    <div className="invalid-feedback">Por favor, selecione uma opção de gênero.</div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoCliente;
