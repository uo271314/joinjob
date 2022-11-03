import React from "react";

import Buscador from "./Buscador";

class Bloque_busqueda extends React.Component {

    constructor(props){

        super(props);

    }

    render(){
        return(
            <div style={{ backgroundColor: "#753696", opacity: "0.9",
            border: "1px solid black", borderRadius: "1.2em",
            marginTop: "5em", marginBottom: "5em",
            marginLeft: "auto", marginRight: "auto",
            paddingTop: "2.7em", paddingBottom: "2em",
            paddingLeft: "3em", paddingRight: "3em",
            width: "40%", lineHeight: "0em", minWidth: "400px" }}>

                <p style={{ color: "white", fontSize: "1.1em" }}>Busco trabajo de ...</p>
                <Buscador supabase={this.props.supabase}/>
                
            </div>
        )
    }
}

export default Bloque_busqueda;