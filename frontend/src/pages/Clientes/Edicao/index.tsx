import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Tipo para o cliente
type Cliente = {
    id: number;
    nome: string;
    nomeSocial?: string;
    cpfValor: string;
    cpfDataEmissao: string;
    genero: string;
};

const EdicaoCliente: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [cliente, setCliente] = useState<Cliente>({
        id: 0,
        nome: '',
        nomeSocial: '',
        cpfValor: '',
        cpfDataEmissao: '',
        genero: '',
    });

    const [generoOpcao, setGeneroOpcao] = useState<'1' | '2' | '3' | '4'>('1');

    // Carregar os dados do cliente ao montar o componente
    useEffect(() => {
        const carregarCliente = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/clientes/${id}`);
                const clienteData = response.data;

                setCliente({
                    id: clienteData.id,
                    nome: clienteData.nome,
                    nomeSocial: clienteData.nomeSocial || '',
                    cpfValor: clienteData.cpf.valor,
                    cpfDataEmissao: new Date(clienteData.cpf.dataEmissao).toLocaleDateString('pt-BR'),
                    genero: clienteData.genero,
                });

                // Mapear o gênero para o valor correto
                const generoMap = {
                    MASCULINO: '1',
                    FEMININO: '2',
                    OUTRO: '3',
                    NAODECLARAR: '4',
                } as const;

                setGeneroOpcao(generoMap[clienteData.genero as keyof typeof generoMap] || '1');
            } catch (error) {
                console.error('Erro ao carregar cliente:', error);
                alert('Não foi possível carregar os dados do cliente.');
                navigate('/clientes'); // Redireciona para a listagem de clientes
            }
        };

        if (id) {
            carregarCliente();
        }
    }, [id, navigate]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setCliente((prev) => ({ ...prev, [name]: value }));
        if (name === 'generoOpcao') setGeneroOpcao(value as '1' | '2' | '3' | '4');
    };

    const handleEditar = async (e: React.FormEvent) => {
        e.preventDefault();

        const { nome, cpfValor, cpfDataEmissao, nomeSocial } = cliente;

        // Validação dos campos obrigatórios
        if (!nome.trim() || !cpfValor.trim() || !cpfDataEmissao.trim()) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validação da data
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(cpfDataEmissao)) {
            alert('A data de emissão do CPF deve estar no formato dd/mm/aaaa.');
            return;
        }

        // Processamento da data para o backend
        const partes = cpfDataEmissao.split('/');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const ano = parseInt(partes[2], 10);
        const dataEmissaoFormatada = new Date(ano, mes, dia).toISOString();

        // Mapear o gênero para o valor correto para o backend
        const generoMap = {
            '1': 'MASCULINO',
            '2': 'FEMININO',
            '3': 'OUTRO',
            '4': 'NAODECLARAR',
        } as const;

        try {
            // Atualizar o cliente no backend
            await axios.put(`http://localhost:5000/clientes/${id}`, {
                nome,
                nomeSocial,
                cpf: {
                    valor: cpfValor,
                    dataEmissao: dataEmissaoFormatada,
                },
                genero: generoMap[generoOpcao],
            });

            alert('Cliente editado com sucesso!');
            navigate('/clientes'); // Redireciona para a listagem de clientes
        } catch (error) {
            console.error('Erro ao editar cliente:', error);
            alert('Não foi possível salvar as alterações do cliente.');
        }
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
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Data de Emissão do CPF (dd/mm/aaaa):</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cpfDataEmissao"
                        value={cliente.cpfDataEmissao}
                        onChange={handleChange}
                        placeholder="Digite a data de emissão do CPF"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">(*) Gênero:</label>
                    <select
                        className="form-select"
                        name="generoOpcao"
                        value={generoOpcao}
                        onChange={handleChange}
                        required
                    >
                        <option value="1">Masculino</option>
                        <option value="2">Feminino</option>
                        <option value="3">Outro</option>
                        <option value="4">Não desejo declarar</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EdicaoCliente;
