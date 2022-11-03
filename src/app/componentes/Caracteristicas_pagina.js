import React from "react";

import { Col, Row } from "antd";

class Caracteristicas_pagina extends React.Component {
    render(){

        let estilo_caracteristica = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }

        let estilo_texto = {
            fontSize: "1.1em", 
            textAlign: "center",
            marginTop: "1.7em"
        }

        return(
            <div style={{ marginTop: "2em", marginBottom: "2em" }}>
                <Row gutter={30} style={{ width: "70%", margin: "auto" }}>
                    <Col span={8} style={ estilo_caracteristica }>
                        <img src="/icono_caracteristicas_facil.png" alt="icono que representa la característica facil de usar" /> 
                    </Col>

                    <Col span={8} style={ estilo_caracteristica  }>
                        <img src="/icono_caracteristicas_gratis.png" alt="icono que representa la característica servicio gratuito" /> 
                    </Col>

                    <Col span={8} style={ estilo_caracteristica  }>
                        <img src="/icono_caracteristicas_ayuda.png" alt="icono que representa la característica ayuda en las consultas" /> 
                    </Col>
                </Row>

                <Row gutter={30} style={{ width: "70%", margin: "auto" }}>
                    <Col span={8} style={ estilo_texto }>
                        <p>Rápido y fácil de usar.</p> 
                    </Col>

                    <Col span={8} style={ estilo_texto  }>
                        <p>Servicio <strong>gratuito</strong> de publicación y búsquedas de ofertas de empleo.</p> 
                    </Col>

                    <Col span={8} style={ estilo_texto  }>
                        <p>Autocompletado de búsquedas.</p>  
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Caracteristicas_pagina;