import React from "react";
import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Card, Col, Row, Divider } from "antd";
import { Button, Form, Input } from "antd";
import { Alert } from "antd";

import Selector_tamano_empresa from "./Selector_tamano_empresa";

class Bloque_registro extends React.Component {

    constructor(props){

        super(props);

        this.state={
            nombre_creador: "",
            email: "",
            contraseña: "",
            nombre_empresa: "",
            CIF: "",
            descripcion: "",
            tamaño: "",
            pais: "",
            cod_postal: "",
            ubicacion: "",

            error_registro: false
        }
    }

    // Método que accede a la función callback_autenticacion de App para influir sobre su estado.
    registro_datos_acceso(datos){

        this.setState({
            nombre_creador: datos.nombre,
            email: datos.email,
            contraseña: datos.contrasena
        });

    }

    registro_datos_empresa(datos){

        this.setState({
            nombre_empresa: datos.nombre,
            CIF: datos.cif,
            descripcion: datos.descripcion
        });

    }

    registro_tamano_empresa = async(tam) =>{

        this.setState({
            tamaño: tam
        });

    }
    
    registro_ubicacion_empresa = async(datos) => {
       
        this.setState({
            pais: datos.pais,
            cod_postal: datos.cod_postal,
            ubicacion: datos.ciudad
        });

        // Registro de usuario
        const { data, error } = await this.props.supabase.auth.signUp({
            email: this.state.email,
            password: this.state.contraseña,
            data: { confirmation_sent_at: Date.now() }
        });

        if (error == null){

            let empresa = {
                nombre_creador: this.state.nombre_creador,
                email: this.state.email,
                nombre_empresa: this.state.nombre_empresa,
                CIF: this.state.CIF,
                descripcion: this.state.descripcion,
                tamaño: this.state.tamaño,
                pais: datos.pais,
                cod_postal: datos.cod_postal,
                ubicacion: datos.ciudad        
            }

            // Registro de empresa
            const { data_empresa, error_empresa } = await this.props.supabase
                .from('empresa')
                .insert([ empresa ])

            if (error == null){

                // Identificación de la empresa
                const { data, error } = await this.props.supabase.auth.signInWithPassword({
                    email: this.state.email,
                    password: this.state.contraseña
                });
        
                if(error == null && data.user != null){
                    this.props.callback_autenticacion({"usuario": data.user});
                    this.props.rutas("/area_personal");
                }
                else {
                    this.props.callback_autenticacion({});
                    this.setState({
                        error_registro: true
                    });
                }

                this.props.rutas("/area_personal");
            }

            else
                this.setState({
                    error_registro: true
                });
        }

        else 
            this.setState({
                error_registro: true
            });

    }

    render(){

        return(
            <div>
            <Card title="Registro de tu empresa" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                <Row gutter={100} style={{ justifyContent: "center", height: "100%" }}>
                    <Col span={24}>

                        <Row style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "0.7em" }}>
                            <h3 style={{ paddingLeft: "1.1em" }}>Datos de acceso</h3>
                            <Divider style={{ borderTop: "1px solid #753696", marginTop: "0em" }} />
                            <p style={{ paddingBottom: "0.7em", marginLeft: "2em", opacity: "0.5" }}>
                                Registra tu empresa para empezar a publicar ofertas de trabajo de forma gratuita.
                            </p>
                        </Row>

                        <Form name="formulario_registro_datos_acceso" labelCol={{span: 24/3}} 
                            wrapperCol={{ span: 24/3}} initialValues={{remember: true,}}
                            onFinish={ datos => this.registro_datos_acceso(datos) } autoComplete="off">

                            <Form.Item label="Tu nombre y apellidos"  name="nombre"
                                rules={[
                                    { required: true, message: "Debe introducir un nombre obligatoriamente" }
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Email de contacto" name="email"
                                rules={[ 
                                    { required: true, message: "Debe introducir un email obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Contraseña"  name="contrasena"
                                rules={[
                                    { required: true, message: "Debe introducir una contraseña obligatoriamente", },
                                    { min: 6, message: "Debe introducir una contraseña de más de 6 caracteres", }
                                ]}>
                                    
                                <Input.Password />
                            </Form.Item>

                            <Form.Item Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                                <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }} 
                                    htmlType="submit" block>Continuar</Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>

            </Card>


            <Card title="Registro de tu empresa" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                <Row gutter={100} style={{ justifyContent: "center", height: "100%" }}>
                    <Col span={24}>

                        <Row style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "1.3em" }}>
                            <h3 style={{ paddingLeft: "1.1em" }}>Datos de tu empresa</h3>
                            <Divider style={{ borderTop: "1px solid #753696", marginTop: "0em" }} />
                        </Row>

                        <Form name="formulario_registro_datos_empresa" labelCol={{span: 24/3}} 
                            wrapperCol={{ span: 24/3}} initialValues={{remember: true,}}
                            onFinish={ datos => this.registro_datos_empresa(datos) } autoComplete="off">

                            <Form.Item label="Nombre de la empresa"  name="nombre"
                                rules={[
                                    { required: true, message: "Debe introducir el nombre de su empresa obligatoriamente", },
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Identificación fiscal (C.I.F o N.I.F)" name="cif"
                                rules={[ 
                                    { required: true, message: "Debe introducir el C.I.F de su empresa obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Descripción de la empresa"  name="descripcion"
                                rules={[
                                    { required: false },
                                ]}>
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                                <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }} 
                                    htmlType="submit" block>Continuar</Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>

            </Card>

            <Card title="Registro de tu empresa" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                <Row gutter={100} style={{ justifyContent: "center", height: "100%" }}>
                    <Col span={24}>

                        <Row style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "1.3em" }}>
                            <h3 style={{ paddingLeft: "1.1em" }}>Tamaño de tu empresa</h3>
                            <Divider style={{ borderTop: "1px solid #753696", marginTop: "0em" }} />
                            <p style={{ opacity: "0.5" }}>Selecciona el tamaño de tu empresa:</p>
                        </Row>

                        <Form name="formulario_registro_tamano_empresa" initialValues={{remember: true,}}
                            autoComplete="off">
                            
                            <Selector_tamano_empresa callback_registro_tam_empresa={this.registro_tamano_empresa}/>

                        </Form>

                    </Col>
                </Row>

            </Card>

            <Card title="Registro de tu empresa" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                <Row gutter={100} style={{ justifyContent: "center", height: "100%" }}>
                    <Col span={24}>

                        <Row style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "1.3em" }}>
                            <h3 style={{ paddingLeft: "1.1em" }}>Ubicación de tu empresa</h3>
                            <Divider style={{ borderTop: "1px solid #753696", marginTop: "0em" }} />
                        </Row>

                        <Form name="formulario_registro_ubicacion_empresa" labelCol={{span: 24/3}} 
                            wrapperCol={{ span: 24/3}} initialValues={{remember: true,}}
                            onFinish={ datos => this.registro_ubicacion_empresa(datos) } autoComplete="off">

                            <Form.Item label="País"  name="pais"
                                rules={[
                                    { required: true, message: "Debe introducir el país de su empresa obligatoriamente", },
                                ]}>
                                <Input />
                            </Form.Item>
                            
                            <Form.Item label="Código postal"  name="cod_postal"
                                rules={[
                                    { required: true, message: "Debe introducir el código postal de su empresa obligatoriamente", },
                                ]}>
                                <Input />
                            </Form.Item>
                            
                            <Form.Item label="Ubicación en el país"  name="ciudad"
                                rules={[
                                    { required: true, message: "Debe introducir la ciudad y/o comunidad autónoma de su empresa obligatoriamente", },
                                ]}>
                                <Input />
                            </Form.Item>

                            {
                                this.state.error_registro ? 
                                <Alert style={{ marginBottom: "1.2em" }}
                                    message={<div style={{ lineHeight: "0.8em", paddingLeft: "0.8em", paddingTop: "0.5em" }}>
                                                <p>Error: Datos incorrectos</p>
                                                <p style={{ fontSize: "0.8em" }}>Comprueba los datos introducidos.</p>
                                            </div>}
                                    type="error"
                                    showIcon
                                    closable
                                /> : <div></div>
                            }

                            <Form.Item Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                                <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }} 
                                    htmlType="submit" block>Continuar</Button>
                            </Form.Item>
                        </Form>

                    </Col>
                </Row>

            </Card>

            </div>
        )
    }
}

export default decorador_rutas(Bloque_registro);