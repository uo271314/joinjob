import React from "react";
import decorador_rutas from "../../decoradores/parametros_y_rutas";

import { Card, Col, Row } from "antd";
import { Button, Form, Input } from "antd";

class Bloque_publicar_oferta extends React.Component {

    constructor(props){

        super(props);

    }

    publicar_oferta = async(datos) => {

        // Seleccionar la tecnología o crear una nueva
        var { data: tecnologia, error } = await this.props.supabase
            .from('tecnologia')
            .select('nombre')

        let tecnologia_existente = tecnologia.filter(x => x.nombre === datos.tecnologias).length > 0;
        if (!tecnologia_existente){

            await this.props.supabase
                .from("tecnologia")
                .insert([{ "nombre": datos.tecnologias }]);

        }

        // Crear la oferta y la publicación
        var { data, error } = await this.props.supabase
            .rpc('insert_oferta_id', { 
                tipo_trabajo: datos.tipo_trabajo,
                descripcion: datos.descripcion,
                experiencia_requerida: datos.experiencia_requerida,
                salario: datos.salario,
                tecnologias: [datos.tecnologias],
                nivel_tecnologias: [datos.nivel_tecnologias],
                teletrabajo: datos.teletrabajo
            });

            const id_oferta = data;

        if (error == null){
            
            var { data, error } = await this.props.supabase
                .from('publicacion')
                .insert([{ 
                    "oferta_id": id_oferta,
                    "empresa_email": this.props.usuario.email,
                    "estado": "Publicada"
                }]);

            if (error == null)
                this.props.rutas("/area_personal");           
        }
    }

    render(){
        return(
            <Card type="inner" title="Área personal: Publicar oferta" 
                style={{ width: "70%", border: "1px solid #f0f2f5", borderRadius: "1.2em",
                    marginLeft: "auto", marginRight: "auto", marginTop: "2%" }}>

                <Row gutter={50} style={{ width: "100%" }}>
                    <Col style={{  width: "85%" }}></Col>
                    <Col style={{ width: "15%" }}>
                        <Button style={{ alignSelf: "center", color: "#753696" }} 
                            type="default" onClick={() => this.props.rutas('/area_personal')}>
                            VOLVER
                        </Button>
                    </Col>
                </Row>

                <Form name="formulario_publicar_oferta" labelCol={{span: 24/3}} 
                    wrapperCol={{ span: 24/3}} initialValues={{remember: true,}}
                    onFinish={ datos => this.publicar_oferta(datos) } autoComplete="off">

                            <Form.Item label="Tipo de trabajo" name="tipo_trabajo"
                                rules={[ 
                                    { required: true, message: "Debe introducir un tipo de trabajo obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Descripción" name="descripcion"
                                rules={[ 
                                    { required: true, message: "Debe introducir una descripción del trabajo obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Experiencia requerida" name="experiencia_requerida"
                                rules={[ 
                                    { required: true, message: "Debe introducir la experiencia requerida obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Salario (€)" name="salario"
                                rules={[ 
                                    { required: true, message: "Debe introducir un salario obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Tecnologías" name="tecnologias"
                                rules={[ 
                                    { required: true, message: "Debe introducir las tecnologías necesarias obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Nivel de tecnologías" name="nivel_tecnologias"
                                rules={[ 
                                    { required: true, message: "Debe introducir el nivel de las tecnologías obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Teletrabajo" name="teletrabajo"
                                rules={[ 
                                    { required: true, message: "Debe introducir si tiene opción de teletrabajo obligatoriamente",},
                                ]}>
                                <Input />
                            </Form.Item>

                            <Form.Item Item wrapperCol={{ xs: { offset: 0 }, sm: { offset: 8, span: 24/3 } }} >
                                <Button type="default" style={{ backgroundColor: "#83AD6C", color: "black" }} 
                                    htmlType="submit" block>Publicar oferta</Button>
                            </Form.Item>
                        </Form>

            </Card>
        )
    }
}

export default decorador_rutas(Bloque_publicar_oferta);