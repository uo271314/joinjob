import React from "react";
import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Card, Col, Row, Divider } from "antd";
import { Button, Form, Input } from "antd";
import { Alert } from "antd";
import { AuditOutlined } from "@ant-design/icons";

class Bloque_identificacion extends React.Component {

    constructor(props){

        super(props);
        
        this.state = {
            error_login: false
        }

    }

    // Método que accede a la función callback_autenticacion de App para influir sobre su estado.
    identificacion = async(datos) => {
        this.setState({
            error_login: false
        });

        const { data, error } = await this.props.supabase.auth.signInWithPassword({
            email: datos.email,
            password: datos.contrasena
        });

        if(error == null && data.user != null){
            this.props.callback_autenticacion({"usuario": data.user});
            this.props.rutas("/area_personal");
        }
        else {
            this.props.callback_autenticacion({});
            this.setState({
                error_login: true
            });
        }
    }

    render(){
        return(
            <Card title="Acceso empresas" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "9%" }}>

                <Row gutter={100} style={{ justifyContent: "center", height: "100%" }}>
                    <Col span={16}>

                        <Row style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginBottom: "1.3em" }}>
                            <h3 style={{ paddingLeft: "1.1em" }}>Inicio de sesión</h3>
                            <Divider style={{ borderTop: "1px solid #753696", marginTop: "0em" }} />
                        </Row>

                        <Form name="formulario_identificacion" labelCol={{span: 24/3}} 
                            wrapperCol={{ span: 24/3}} initialValues={{remember: true,}}
                            onFinish={ datos => this.identificacion(datos) } autoComplete="off">

                            <Form.Item label="Email" name="email"
                                rules={[ 
                                    { required: true, message: "Debe introducir un email obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Contraseña"  name="contrasena"
                                rules={[
                                    { required: true, message: "Debe introducir una contraseña obligatoriamente", },
                                ]}>
                                <Input.Password />
                            </Form.Item>

                            {
                                this.state.error_login ? 
                                <Alert style={{ marginBottom: "1.2em" }}
                                    message={<div style={{ lineHeight: "0.8em", paddingLeft: "0.8em", paddingTop: "0.5em" }}>
                                                <p>Error: Datos incorrectos</p>
                                                <p style={{ fontSize: "0.8em" }}>El usuario y/o la contraseña no coinciden con ningún usuario registrado.</p>
                                            </div>}
                                    type="error"
                                    showIcon
                                    closable
                                /> : <div></div>
                            }

                            <Form.Item Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                                <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }} 
                                    htmlType="submit" block>Iniciar sesión</Button>
                            </Form.Item>
                        </Form>

                    </Col>

                    <Divider type="vertical" style={{ height: "17.5em" }} />

                    <Col span={7}>
                        <Row style={{ width: "80%", margin: "auto", justifyContent: "center", opacity: "0.5" }}>
                            <h3>¿Eres nuevo?</h3>
                            <Divider style={{ marginTop: "0em" }} />

                            <Row style={{ textAlign: "justify", textJustify: "inter-word", marginBottom: "0.7em" }}>
                                <Col span={10}>
                                    <AuditOutlined style={{ fontSize: "1.7em", paddingLeft: "0.9em", paddingTop: "1.3em" }} />
                                </Col>

                                <Col span={14} style={{ paddingRight: "1em" }}>
                                    <p>Regístrate para publicar tus ofertas de trabajo de forma gratuita.</p>
                                </Col>
                            </Row>
                            
                            <Button type="default" style={{ borderTop: "1px solid #f0f2f5" }}
                                onClick={() => this.props.rutas('/registro')}>
                                Crea tu cuenta
                            </Button>
                        </Row>
                    </Col>
                </Row>

            </Card>
        )
    }
}

export default decorador_rutas(Bloque_identificacion);