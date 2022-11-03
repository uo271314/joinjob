import React from 'react';

import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Select, Tag } from 'antd';

class Filtros extends React.Component {

    constructor(props){

        super(props);
        this.state={
            tecnologias: []
        }

    }

    componentDidMount = async() => {

        let { data: tecnologia, error } = await this.props.supabase
            .from('tecnologia')
            .select("nombre")
            .order("nombre", { ascending: true })

        if (error == null){
            let tecnologias = [];
            tecnologia.map(x => tecnologias.push({ value: x["nombre"] }));
            this.setState({
                tecnologias: tecnologias
            });
        }

    }

    nuevo_filtro = async(filtro) => {
        this.props.rutas("/busqueda/" + this.props.valor + "/[" + filtro + "]");
    }

    render(){

        const tagRender = (props) => {
            const { value, closable, onClose } = props;
            const mouse_down = (evento) => { evento.preventDefault(); evento.stopPropagation(); };
            return (
              <Tag color="#753696" onMouseDown={mouse_down} closable={closable} onClose={onClose}
                style={{ marginRight: 3, opacity: "0.7em" }}> {value} </Tag>
            );
          };
        
        return (
          <Select mode="multiple" style={{ width: '40%' }} 
            showArrow options={this.state.tecnologias} 
            tagRender={tagRender} onChange={this.nuevo_filtro} />
        );
    }
}

export default decorador_rutas(Filtros);