import React from "react";

import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input, Button } from "antd";

class Buscador extends React.Component {

  constructor(props){

    super(props);
    this.state={
      resultados: [],
      valor_buscado: ""
    };

  }

  componentDidMount(){
    this.get_resultados_iniciales();
  }

  get_resultados_iniciales(){

    let resultados = [
      {
        label: this.get_titulo_html('Trabajo'),
        options: [],
      },
      {
        label: this.get_titulo_html('Descripción'),
        options: [],
      },
      {
        label: this.get_titulo_html('Tecnologías'),
        options: [],
      }
    ];

    this.setState({
      resultados: resultados
    });

  }

  get_resultados_change = async(evento) => {
    this.get_resultados(evento.target.value);
  }

  get_resultados = async(valor_buscado) => {
    
    this.setState({
      valor_buscado: valor_buscado
    });
    let max_mostrado = 2;

    let ofertas_filtradas_tipo_trabajo = [];
    let ofertas_filtradas_descripcion = [];
    let ofertas_filtradas_tecnologias = [];

    if (valor_buscado !== ""){
      let { data: publicacion, error } = await this.props.supabase
              .from('publicacion')
              .select("oferta_id")
              .neq("estado", "Adjudicada")
              .order("created_at", { ascending: true })

      if (error == null){
        for (let i=0; i<publicacion.length; i++){

          var { data: oferta, error1 } = await this.props.supabase
              .from('oferta')
              .select("tipo_trabajo")
              .eq("id", publicacion[i].oferta_id)
              .ilike("tipo_trabajo", "%" + valor_buscado + "%")

          if(error1 == null && oferta[0] !== undefined)
            ofertas_filtradas_tipo_trabajo.push({
              oferta: oferta[0]["tipo_trabajo"],
              id: publicacion[i].oferta_id
            });

          var { data: oferta, error2 } = await this.props.supabase
              .from('oferta')
              .select("descripcion")
              .eq("id", publicacion[i].oferta_id)
              .ilike("descripcion", "%" + valor_buscado + "%")

          if(error2 == null && oferta[0] !== undefined)
            ofertas_filtradas_descripcion.push({
              oferta: oferta[0]["descripcion"],
              id: publicacion[i].oferta_id
            });

          var { data: oferta, error3 } = await this.props.supabase
            .from('oferta')
            .select("tecnologias")
            .eq("id", publicacion[i].oferta_id)

          if(error3 == null){
            oferta[0]["tecnologias"]
              .map(x => x.toLowerCase())
              .filter(y => y.includes(valor_buscado.toLowerCase()))
              .map(z => ofertas_filtradas_tecnologias.push({
                oferta: z,
                id: publicacion[i].oferta_id
              }));
          }
        }
      }
    }

    let resultados = [
      {
        label: this.get_titulo_html('Trabajo', ofertas_filtradas_tipo_trabajo.length),
        options: ofertas_filtradas_tipo_trabajo.slice(0, max_mostrado).map(x => this.get_resultado_html(x))
      },
      {
        label: this.get_titulo_html('Descripción', ofertas_filtradas_descripcion.length),
        options: ofertas_filtradas_descripcion.slice(0, max_mostrado).map(x => this.get_resultado_html(x))
      },
      {
        label: this.get_titulo_html('Tecnologías', ofertas_filtradas_tecnologias.length),
        options: ofertas_filtradas_tecnologias.slice(0, max_mostrado).map(x => this.get_resultado_html(x))
      },
    ];

    this.setState({
      resultados: resultados
    });

  }

  get_titulo_html(titulo, cantidad){

    return <span>{titulo}
              <span style={{ float: 'right' }}> <UserOutlined /> {cantidad} </span>
           </span>

  }

  get_resultado_html(info){

    return {
      value: info["oferta"],
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {info["oferta"]}
          <a style={{ float: 'right', fontSize: "0.8em" }}
            href={ "/busqueda/detalle/" + info["id"] }>
            ver
          </a>
        </div>
      )
    }

  }

  render(){

    const onSelect = (value, option) => { this.get_resultados(value) };

    return(
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <AutoComplete
          popupClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={500}
          style={{
            width: "80%"
          }}
          options={this.state.resultados}
          onSelect={onSelect}
        >
          <Input placeholder="Puesto, lenguaje..." allowClear onChange={this.get_resultados_change} />
        </AutoComplete>

        <Button 
          style={{ backgroundColor: "#83AD6C", height: "2.33em", color: "black",
          borderLeft: "1.5px solid black", borderRight: "none", borderTop: "none", borderBottom: "none" }} 
          type="default" icon={ <SearchOutlined /> } onClick={ () => {this.props.rutas("/busqueda/" + this.state.valor_buscado)} } >
            BUSCAR
        </Button>
      </div>
    );
  }

}

export default decorador_rutas(Buscador);