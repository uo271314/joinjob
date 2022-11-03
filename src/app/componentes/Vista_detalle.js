import React from "react";

import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Card, Col, Row} from "antd";
import { Button } from "antd";
import { Link } from "react-router-dom";

class Vista_detalle extends React.Component {

    constructor(props){

        super(props);
        this.id = this.props.parametros.id;
        this.state = {
            oferta: {}
        }

    }

    componentDidMount(){
        this.get_detalles_oferta();
    }

    get_detalles_oferta = async() =>{

        let { data: publicacion, error } = await this.props.supabase
            .from('publicacion')
            .select("oferta_id, estado, empresa_email")
            .eq("oferta_id", this.id)

        if (error == null){

            let { data: oferta, error } = await this.props.supabase
                .from('oferta')
                .select()
                .eq("id", this.id)

            if(error == null){
                oferta[0]["estado"] = publicacion[0].estado;
                oferta[0]["empresa_email"] = publicacion[0].empresa_email;
                this.setState({
                    oferta: oferta[0]
                });
            }
        }
    }

    render(){

        return(
            <Card type="inner" title={"Detalle de la oferta: " + this.state.oferta.tipo_trabajo }
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "2%" }}>

                <p>Descripción: {this.state.oferta.descripcion}</p>
                <p>Experiencia requerida: {this.state.oferta.experiencia_requerida}</p>
                <p>Salario: {this.state.oferta.salario} €</p>
                <p>Tecnologías: {this.state.oferta.tecnologias}</p>
                <p>Nivel de tecnologías: {this.state.oferta.nivel_tecnologias}</p>
                <p>Teletrabajo: {this.state.oferta.teletrabajo}</p>
                <p>Email de contacto: <strong>{this.state.oferta.empresa_email}</strong></p>
                <Button style={{ alignSelf: "center", color: "#753696" }} 
                    type="default" onClick={() => this.props.rutas('/busqueda')}>
                    VOLVER
                </Button>
            </Card>
        );
    }
}

export default decorador_rutas(Vista_detalle);