import React from "react";

import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Card, Col, Row} from "antd";
import { Button } from "antd";
import { Empty } from 'antd';
import { Link } from "react-router-dom";
import Filtros from "./Filtros";

class Vista_busqueda extends React.Component {

    constructor(props){

        super(props);
        this.state={
            ofertas_publicadas: []
        }

    }

    componentDidMount = async() =>{ this.cargar_resultados(); }

    cargar_resultados = async() => {
        return this.props.parametros.valor === (undefined ||"undefined") ?
            await this.get_ofertas_publicadas(0, 15)
            :
            await this.get_resultados_filtrados_buscador(this.props.parametros.valor)
    }

    componentDidUpdate = async(prevProps) => {
        if(this.props.parametros.valor !== prevProps.parametros.valor)
            await this.cargar_resultados();

        if(this.props.parametros.tecnologia !== prevProps.parametros.tecnologia){
            let res = await this.cargar_resultados();
            if(this.props.parametros.tecnologia !== undefined && 
               this.props.parametros.tecnologia !== "undefined" &&
               this.props.parametros.tecnologia !== [] &&
               this.props.parametros.tecnologia !== "[]"){
                console.log("entra")
                await this.filtro_tecnologia(this.props.parametros.tecnologia, res);
            }
        }
    }

    get_ofertas_publicadas = async(from, to) => {

        let { data: publicacion, error } = await this.props.supabase
            .from('publicacion')
            .select("oferta_id, estado, empresa_email")
            .neq("estado", "Adjudicada")
            .order("created_at", { ascending: true })
            //.range(from, to)

        if (error == null){

            let ofertas_publicadas = [];
            for (let i=0; i<publicacion.length; i++){

                let { data: oferta, error } = await this.props.supabase
                    .from('oferta')
                    .select()
                    .eq("id", publicacion[i].oferta_id)

                if(error == null){
                    oferta[0]["estado"] = publicacion[i].estado;
                    oferta[0]["empresa_email"] = publicacion[i].empresa_email;
                    ofertas_publicadas.push(oferta[0]);
                }
            }
            this.setState({
                ofertas_publicadas: ofertas_publicadas
            });
            return ofertas_publicadas;

        }
    }

    get_resultados_filtrados_buscador = async(valor_buscado) => {
        let ofertas_publicadas = [];
    
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
                  .select()
                  .eq("id", publicacion[i].oferta_id)
                  .ilike("tipo_trabajo", "%" + valor_buscado + "%")
    
              if(error1 == null && oferta.length > 0)
                ofertas_publicadas.push(oferta[0]);

              else{
        
                var { data: oferta, error2 } = await this.props.supabase
                    .from('oferta')
                    .select()
                    .eq("id", publicacion[i].oferta_id)
                    .ilike("descripcion", "%" + valor_buscado + "%")
        
                if(error2 == null && oferta.length > 0)
                    ofertas_publicadas.push(oferta[0]);

                else {
        
                    var { data: oferta, error3 } = await this.props.supabase
                        .from('oferta')
                        .select()
                        .eq("id", publicacion[i].oferta_id)
            
                    if(error3 == null){
                        if (oferta[0]["tecnologias"]
                            .map(x => x.toLowerCase())
                            .filter(y => y.includes(valor_buscado.toLowerCase())).length > 0)
                            ofertas_publicadas.push(oferta[0]);
                    }
                }
              }
            }
          }
        } 
        
        this.setState({
            ofertas_publicadas: ofertas_publicadas
        });
        return ofertas_publicadas;
      }

      filtro_tecnologia = async(tecnologias, ofertas_cargadas) => {
        let ofertas_filtradas = ofertas_cargadas.filter(x => x["tecnologias"].some(y => tecnologias.includes(y)));
        this.setState({
            ofertas_publicadas: ofertas_filtradas
        });
      }

    render(){
        return(
            <div>
                <Filtros supabase={this.props.supabase} valor={this.props.parametros.valor} />
                <Row gutter={ [16, 16] } style={{ marginTop: "2em", marginBottom: "2em",
                marginLeft: "4em", marginRight: "4em" }}>

                    {
                        this.state.ofertas_publicadas.length > 0 ?

                            this.state.ofertas_publicadas.map(oferta => {
                                return(
                                    <Col xs={24} sm={14} md={10} lg={6} xl={5} >
                                        <Link to={ "/busqueda/detalle/" + oferta.id }>
                                            <Card title={ oferta.tipo_trabajo }
                                                style={{ border: "1px solid #f0f2f5", borderRadius: "1.2em",
                                                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                                                <p>{ oferta.descripcion }</p>
                                                <p>{ oferta.salario }€</p>
                                                <p>{ oferta.tecnologias }</p>
                                            </Card>
                                        </Link>
                                    </Col>
                                )
                            })
                            :
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                imageStyle={{ height: 60 }}
                                style={{ margin: "auto", marginTop: "2em" }}
                                description={
                                    <span>
                                        <p>No hay <strong>ningún resultado</strong> para su búsqueda</p>
                                        <p>Pruebe de nuevo</p>
                                    </span>
                                }
                            ></Empty>
                    }

                </Row>
            </div>
        );
    }
}

export default decorador_rutas(Vista_busqueda);