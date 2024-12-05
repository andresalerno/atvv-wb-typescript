import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Tipo de Props para CadastroCliente
type CadastroClienteProps = {
    clientes: any[];
    setClientes: React.Dispatch<React.SetStateAction<any[]>>;
};

const CadastroCliente: React.FC<CadastroClienteProps> = ({ clientes, setClientes }) => {
    const navigate = useNavigate();

    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [cpfValor, setCpfValor] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [generoOpcao, setGeneroOpcao] = useState<'1' | '2' | '3' | '4'>('1');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        switch (name) {
            case 'nome':
                setNome(value);
                break;
            case 'nomeSocial':
                setNomeSocial(value);
                break;
            case 'cpfValor':
                setCpfValor(value);
                break;
            case 'dataEmissao':
                setDataEmissao(value);
                break;
            case 'generoOpcao':
                setGeneroOpcao(value as '1' | '2' | '3' | '4');
                break;
            default:
                break;
        }
    };

    const handleCadastrar = (e: React.FormEvent) => {
        e.preventDefault();

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

        // Mapeamento do gênero
        const generoMap: { [key in typeof generoOpcao]: string } = {
            '1': 'Masculino',
            '2': 'Feminino',
            '3': 'Outro',
            '4': 'Não declarar'
        };
        const generoDescricao = generoMap[generoOpcao];

        // Criação do cliente e atualização da lista de clientes
        const idCliente = clientes.length + 1;
        const novoCliente = {
            id: idCliente,
            nome,
            nomeSocial,
            cpf: cpfValor,
            dataEmissao: dataEmissaoFormatada,
            genero: generoDescricao,
        };
        setClientes([...clientes, novoCliente]);

        alert('Cliente cadastrado com sucesso!');
        navigate('/clientes');
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Cadastro de Cliente</h2>
            <form onSubmit={handleCadastrar} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">(*) Nome:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nome"
                        value={nome}
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
                        value={nomeSocial}
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
                        value={cpfValor}
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
                        value={dataEmissao}
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
                        value={generoOpcao}
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
                <button type="submit" className="btn btn-primary w-100">Cadastrar</button>
            </form>
        </div>
    );
};

export default CadastroCliente;
