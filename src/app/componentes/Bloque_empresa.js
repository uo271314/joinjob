import React from "react";
import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Button } from "antd";

class Bloque_empresa extends React.Component {
    render(){
        return(
            <div style={{ backgroundColor: "#753696", 
            border: "1px solid black", 
            marginTop: "5em", marginBottom: "5em",
            marginLeft: "auto", marginRight: "auto",
            paddingTop: "2.5em", paddingBottom: "2em",
            paddingLeft: "3em", paddingRight: "3em",
            width: "30%", lineHeight: "0em", minWidth: "350px",
            display: "flex", alignItems: "center", justifyContent: "center" }}>

                <p style={{ color: "white", fontSize: "1.1em", marginBottom: "0em", marginRight: "1.1em", lineHeight: "20px" }}>¿Eres una empresa?</p>
                <Button style={{ marginLeft: "1.1em", color: "#753696" }} type="default"
                    onClick={() => this.props.rutas('/registro')}>PUBLICA UNA OFERTA</Button>

            </div>
        )
    }
}

export default decorador_rutas(Bloque_empresa);