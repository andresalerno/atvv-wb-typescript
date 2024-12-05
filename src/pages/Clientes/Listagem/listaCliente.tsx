import { Component } from "react";
import 'materialize-css/dist/css/materialize.min.css';
import { useNavigate } from 'react-router-dom';


type props = {
    tema: string
    navigate?: (path: string) => void;
}

export default class ListaCliente extends Component<props> {
    constructor(props: props) {
        super(props);
        this.handleEditar = this.handleEditar.bind(this);
    }

    handleEditar(clienteId: number) {
        const { navigate } = this.props;
        navigate && navigate(`/editar-cliente/${clienteId}`);
    }

    render() {
        let estilo = `collection-item active ${this.props.tema}`;
        return (
            <div className="collection">
                <a className="collection-item" onClick={() => this.handleEditar(1)}>Cliente 1</a>
                <a className={estilo} onClick={() => this.handleEditar(2)}>Cliente 2</a>
                <a className="collection-item" onClick={() => this.handleEditar(3)}>Cliente 3</a>
                <a className="collection-item" onClick={() => this.handleEditar(4)}>Cliente 4</a>
            </div>
        );
    }
}
