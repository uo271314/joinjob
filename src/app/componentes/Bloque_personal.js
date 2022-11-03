import React from "react";
import decorador_rutas from "../../decoradores/parametros_y_rutas";

import Tabs_personal from "./Tabs_personal";

import { Card, Col, Row } from "antd";
import { Avatar } from "antd";
import { Button, Tooltip } from 'antd';
import { InfoCircleOutlined } from "@ant-design/icons";
import { Typography, notification } from "antd";

class Bloque_personal extends React.Component {

    constructor(props){

        super(props);
        this.state = {
            empresa: {}
        }

    }

    componentDidMount = async() => {

        const { data, error } = await this.props.supabase
            .from("empresa")
            .select()
            .eq("email", this.props.usuario.email)

        if(error == null && data.length > 0){
            data[0]["cod_postal"] = data[0]["cod_postal"].toString();
            this.setState({
                empresa: data[0]
            });

        }

    }

    editar_campo = async (info) =>{
        const { data, error } = await this.props.supabase
            .from('empresa')
            .update(info)
            .eq('email', this.props.usuario.email)

        if (error == null){
            let estado_actual = this.state.empresa;
            estado_actual[Object.keys(info)[0]] = Object.values(info)[0];
            estado_actual["cod_postal"] = estado_actual["cod_postal"].toString();
            this.setState({
                empresa: estado_actual
            })
        }
        else {
            notification.open({
                message: 'Error en la actualización',
                description:
                  'No se ha podido llevar a cabo la actualización.',
                duration: 4
            })
        }

    }

    editar_nombre_creador = async(nuevo_valor) => { this.editar_campo({"pais": nuevo_valor}); }
    editar_codigo_postal = async(nuevo_valor) => { this.editar_campo({"cod_postal": parseInt(nuevo_valor)}); }
    editar_ubicacion = async(nuevo_valor) => { this.editar_campo({"ubicacion": nuevo_valor}); }
    editar_descripcion = async(nuevo_valor) => { this.editar_campo({"descripcion": nuevo_valor}); }

    render(){

        const { Text, Paragraph } = Typography;

        return(
            <Card type="inner" title="Área personal" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "2%" }}>

                <Row gutter={50} style={{ width: "100%" }}>
                    <Col style={{ width: "20%" }}>
                        <Avatar style={{ width: "8em", height: "8em" }} size="large" >
                            { this.props.usuario.email.charAt(0) }
                        </Avatar>
                    </Col>

                    <Col style={{ padding: "1.2em", width: "65%" }}>
                        <Row>
                            <h1 style={{ fontSize: "2em" }}>{this.state.empresa.nombre_empresa}</h1>
                        </Row>

                        <Row>
                            <Col style={{ marginRight: "5em" }}>
                                <p>Email de contacto: <strong>{this.state.empresa.email}</strong></p>
                            </Col>

                            <Col style={{ width: "fit-content", justifyContent: "right" }}>
                                <Row>
                                    <p style={{ marginRight: "0.6em" }}>CIF: {this.state.empresa.CIF}</p>
                                    <Tooltip title="Este dato se ocultará a los interesados">
                                        <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                                    </Tooltip>
                                </Row>
                            </Col>
                        </Row>
                    </Col>

                    <Col style={{ width: "15%" }}>
                        <Button style={{ alignSelf: "center", color: "#753696" }} 
                            type="default" onClick={() => this.props.rutas('/area_personal/publicar_oferta')}>
                            Publicar oferta
                        </Button>
                    </Col>
                </Row>

                    <h2>Bienvenid@ {this.state.empresa.nombre_creador}</h2>
                    <p>Configura a continuación los datos sobre tu empresa que se mostrarán a los interesados.</p>

                    <Row>
                        <p style={{ paddingRight: "1.1em" }}>País:</p>
                        <Text editable={{ onChange: this.editar_nombre_creador }}>
                            {this.state.empresa.pais}
                        </Text>
                    </Row>
                    <Row>
                        <p style={{ paddingRight: "1.1em" }}>Código postal:</p>
                        <Text editable={{ onChange: this.editar_codigo_postal }}>
                            {this.state.empresa.cod_postal}
                        </Text>
                    </Row>
                    <Row>
                        <p style={{ paddingRight: "1.1em" }}>Ubicación:</p>
                        <Text editable={{ onChange: this.editar_ubicacion }}>
                            {this.state.empresa.ubicacion}
                        </Text>
                    </Row>
                    <p>Tamaño: {this.state.empresa.tamaño}</p>
                    <Row>
                        <p style={{ paddingRight: "1.1em" }}>Descripción:</p>
                        <Paragraph editable={{ onChange: this.editar_descripcion }}>
                            {this.state.empresa.descripcion}
                        </Paragraph>
                    </Row>

                    <Tabs_personal supabase={this.props.supabase} usuario={this.props.usuario} />

            </Card>
        )
    }
}

export default decorador_rutas(Bloque_personal);