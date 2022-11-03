import React from "react";
import { createClient } from "@supabase/supabase-js";
import { Route, Routes, Link } from "react-router-dom";
import decorador_rutas from "../decoradores/parametros_y_rutas";

import { Layout, Col, Row } from "antd";
import { Avatar, Button } from "antd";
import { PoweroffOutlined } from '@ant-design/icons';

import Bloque_busqueda from "./componentes/Bloque_busqueda";
import Vista_busqueda from "./componentes/Vista_busqueda";
import Vista_detalle from "./componentes/Vista_detalle";
import Bloque_empresa from "./componentes/Bloque_empresa";
import Bloque_identificacion from "./componentes/Bloque_identificacion";
import Bloque_registro from "./componentes/Bloque_registro";
import Bloque_personal from "./componentes/Bloque_personal";
import Bloque_publicar_oferta from "./componentes/Bloque_publicar_oferta";
import Caracteristicas_pagina from "./componentes/Caracteristicas_pagina";

class App extends React.Component {
    
    constructor(props){

        super(props);

        const opciones = {
            schema: "public",
            headers: { "x-my-custom-header": "joinjob" },
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        };

        const supabase = createClient(
            "https://wjqiedcyqepdxmnmajek.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcWllZGN5cWVwZHhtbm1hamVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY5NDkyMTIsImV4cCI6MTk4MjUyNTIxMn0.NmQ-3seQnGHwhEXv44iBnVqQV1SaIm5-Fow3xAHe0ag",
            opciones
        );
        this.supabase = supabase;

        this.state = {
            usuario: null
        }

        this.rutas_ven_buscador = ["/", "/busqueda"];
        this.rutas_acceso_empresas  = ["/identificacion", "/registro"];

    }

    /* Método que comprueba si el usuario autenticado existe y en caso afirmativo, lo incorpora a la
         sesión de App. */
    callback_autenticacion = async(autenticacion) => {

        if(autenticacion != {})
            this.setState({
                usuario: autenticacion.usuario
            });

    }

    cerrar_sesion = async() => {

        let { error } = await this.supabase.auth.signOut();

        this.setState({
            usuario: null
        });
        this.props.rutas("/");

    }

    render(){

        const { Header, Content, Footer } = Layout;

        return(
            <Layout className="layout" style={{ minHeight: "100vh" }}>
                <Header style={{ height: "fit-content", 
                backgroundImage: "url('fondo_cabecera.jpg')",
                backgroundSize: "cover"}}>
                    <Row>
                        <Link to={ "/" }>
                            <Col xs={18} sm={17} md={10} lg={9} xl={8}>
                                <img src="/logo.png" /> 
                            </Col>
                        </Link>

                        <Col xs= {6} sm={7} md={14} lg={15} xl={16}
                            style={{ display: "flex", flexDirection: "row-reverse" }}>

                                {
                                    this.rutas_acceso_empresas.includes(window.location.href.toString().split(window.location.host)[1]) ?
                                        <Button style={{ alignSelf: "center", color: "#753696" }} 
                                            type="default" onClick={() => this.props.rutas('/')}>
                                            INICIO
                                        </Button>
                                        :
                                        (this.state.usuario != null ? 
                                            <div>
                                                <Button style={{ alignSelf: "center", color: "#753696", marginRight: "1.7em" }} 
                                                    type="default" onClick={() => this.cerrar_sesion()} icon={<PoweroffOutlined />}>
                                                    Cerrar sesión
                                                </Button>

                                                <Avatar style={{ width: "3em", height: "3em"  }} size="large" >
                                                    { this.state.usuario.email.charAt(0) }
                                                </Avatar>
                                            </div>
                                            : 
                                            <Button style={{ alignSelf: "center", color: "#753696" }} 
                                                type="default" onClick={() => this.props.rutas('/identificacion')}>
                                                ACCESO EMPRESAS
                                            </Button>
                                        )
  
                                }

                        </Col>
                    </Row>

                    <Row>

                        {
                            this.rutas_ven_buscador.includes(window.location.href.toString().split(window.location.host)[1]) ||
                                window.location.href.toString().split(window.location.host)[1].split("/")[1] === "busqueda"?
                                <Bloque_busqueda supabase={this.supabase} /> : <div></div>
                        }

                    </Row>
                </Header>

                <Content>
                    <Routes>
                        <Route path="/" element={ 
                            <div>
                                <Bloque_empresa />
                                <Caracteristicas_pagina/>
                            </div>
                        } />
                        <Route path="/identificacion" element={ 
                        <Bloque_identificacion supabase={this.supabase} callback_autenticacion={this.callback_autenticacion} /> 
                        } />
                        <Route path="/registro" element={ 
                        <Bloque_registro supabase={this.supabase} callback_autenticacion={this.callback_autenticacion} /> 
                        } />
                        <Route path="/area_personal" element={
                        <Bloque_personal supabase={this.supabase} usuario={this.state.usuario} />
                        } />
                        <Route path="/area_personal/publicar_oferta" element={
                        <Bloque_publicar_oferta supabase={this.supabase} usuario={this.state.usuario} />
                        } />
                        <Route path="/busqueda/detalle/:id" element={
                        <Vista_detalle supabase={this.supabase} />
                        } />
                        <Route path="/busqueda" element={
                        <Vista_busqueda supabase={this.supabase} />
                        } />
                        <Route path="/busqueda/:valor" element={
                        <Vista_busqueda supabase={this.supabase} />
                        } />
                        <Route path="/busqueda/:valor/:tecnologia" element={
                        <Vista_busqueda supabase={this.supabase} />
                        } />
                    </Routes>
                </Content>

                <Footer style={{ backgroundColor: "#f0f2f5", color: "#a8a8b0",
                    borderTop: "0.5px solid", paddingBottom: "0.2em", paddingTop: "0.9em", 
                    textAlign: "center", marginTop: "2em" }}>
                    <p>Laura Delgado Álvarez - MIW [2022/23]</p>
                </Footer>
            </Layout>
        );

    }

}

export default decorador_rutas(App);