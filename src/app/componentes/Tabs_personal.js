import React from "react";

import { CalendarOutlined, FundViewOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tabs, Empty } from 'antd';
import { Button, Tooltip, notification } from "antd";

class Tabs_personal extends React.Component {

    constructor(props){

        super(props);
        this.state={
            ofertas_publicadas: []
        }

    }


    componentDidMount = async() => {

        this.get_ofertas_publicadas();

    }

    adjudicar = async(oferta_id) => {

        const { data, error } = await this.props.supabase
            .from('publicacion')
            .update({ estado: "Adjudicada" })
            .eq('oferta_id', oferta_id)

        this.get_ofertas_publicadas();

    }

    async eliminar(oferta_id, oferta_tipo_trabajo){

        const { data, error } = await this.props.supabase
            .from('publicacion')
            .update({ estado: "Pendiente de eliminar" })
            .eq('oferta_id', oferta_id)

        this.get_ofertas_publicadas();

        let cancelar_borrado = false;
        const btn = (
            <Button type="primary" size="small" onClick={() => {cancelar_borrado = true; this.cancelar_borrado(oferta_id, notification)}}>
              Cancelar borrado
            </Button>
          );

        notification.open({
            message: 'La oferta para ' + oferta_tipo_trabajo + ' va a ser eliminada',
            description:
              'En 5 segundos la oferta será eliminada de forma permanente, pulse en "Cancelar borrado" para evitarlo.',
            btn,
            duration: 5
        });
        await new Promise(r => setTimeout(r, 5500));
        if (!cancelar_borrado)
            await this.confirmar_borrado(oferta_id);

    }

    async cancelar_borrado(oferta_id, notification) {

        const { data, error } = await this.props.supabase
            .from('publicacion')
            .update({ estado: "Publicada" })
            .eq('oferta_id', oferta_id)

        this.get_ofertas_publicadas();
        notification.destroy();

    }

    async confirmar_borrado(oferta_id) {   

        var { data, error } = await this.props.supabase
            .from('publicacion')
            .delete()
            .eq('oferta_id', oferta_id)

        var { data, error } = await this.props.supabase
            .from('oferta')
            .delete()
            .eq('id', oferta_id)

        await this.get_ofertas_publicadas();

    }

    get_ofertas_publicadas = async() => {

        let { data: publicacion, error } = await this.props.supabase
            .from('publicacion')
            .select("oferta_id, estado, visualizaciones")
            .eq("empresa_email", this.props.usuario.email)

        if (error == null){

            let ofertas_publicadas = [];
            for (let i=0; i<publicacion.length; i++){

                let { data: oferta, error } = await this.props.supabase
                    .from('oferta')
                    .select()
                    .eq("id", publicacion[i].oferta_id)

                if(error == null){
                    oferta[0]["estado"] = publicacion[i].estado;
                    oferta[0]["visualizaciones"] = publicacion[i].visualizaciones;
                    ofertas_publicadas.push(oferta[0]);
                }
            }

            this.setState({
                ofertas_publicadas: ofertas_publicadas
            });

        }
    }

    render(){

        let sin_datos = 
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 60 }}
                description={
                    <span>
                        <p>Aún no has publicado ninguna oferta</p>
                        <p>Crea ofertas pulsando en el botón "<strong>Publicar oferta</strong>" 
                            que encontrarás en la parte superior de tu área personal. </p>
                    </span>
                }
            ></Empty>

        return(
            <div>
            <Tabs
                defaultActiveKey="1"
                items={[
                    {
                        label:(<span><CalendarOutlined /> Ofertas publicadas </span>),
                        key: 1,
                        children: 
                            <div>
                                {
                                    this.state.ofertas_publicadas.length > 0 ?
                                        this.state.ofertas_publicadas.map(oferta => {
                                            return(
                                                <div>
                                                    <h1>Tipo trabajo: {oferta.tipo_trabajo}</h1>
                                                    <p>Descripción: {oferta.descripcion}</p>
                                                    <p>Experiencia: {oferta.experiencia_requerida}</p>
                                                    <p>Salario: {oferta.salario} €</p>
                                                    <p>Tecnologías: {oferta.tecnologias}</p>
                                                    <p>Nivel tecnologías: {oferta.nivel_tecnologias}</p>
                                                    <p>Teletrabajo: {oferta.teletrabajo}</p>
                                                    <p>Estado: {oferta.estado}</p>
                                                    {
                                                        oferta.estado !== "Adjudicada" && oferta.estado !== "Pendiente de eliminar" ? 
                                                            <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }}
                                                                onClick={ () => this.adjudicar(oferta.id) }>Marcar como adjudicada</Button>
                                                            : <div></div>
                                                    }
                                                    <Tooltip title="Eliminar oferta">
                                                        <Button type="primary" shape="circle" icon={ <DeleteOutlined /> } 
                                                            style={{ backgroundColor: "white", color: "#753696", border: "0.5px solid #753696" }}
                                                            onClick={ () => this.eliminar(oferta.id, oferta.tipo_trabajo)} />
                                                    </Tooltip>
                                                </div>
                                            )
                                        }): sin_datos
                                }
                            </div>
                    },
                    {
                        label:(<span><FundViewOutlined /> Visualizaciones </span>),
                        key: 2,
                        children: 
                            <div>
                                {
                                    this.state.ofertas_publicadas.length > 0 ?
                                        this.state.ofertas_publicadas.map(oferta => {
                                            return(
                                                <div>
                                                    <h1>Tipo trabajo: {oferta.tipo_trabajo}</h1>
                                                    <p>Descripción: {oferta.descripcion}</p>
                                                    <p>Visualizaciones: {oferta.visualizaciones}</p>
                                                </div>
                                            )
                                        }): sin_datos
                                }
                            </div>
                    }
                ]}
            />
            </div>
        );
    }
}

export default Tabs_personal;