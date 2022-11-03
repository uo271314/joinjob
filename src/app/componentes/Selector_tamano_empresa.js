import React, { useState } from 'react';

import { Radio, Button } from "antd";
import { Col, Row } from "antd";

function check_selection(name, value){
  let selected_elto = document.getElementById("col_" + name).children[0].style;
  selected_elto.height = value === name ? "80px" : "40px";
  selected_elto.width = value === name ? "80px" : "40px";
  selected_elto.marginLeft = value === name ? "3em" : "4em";
}

const Selector_tamano_empresa = (props) => {
  const [tam, SetTam] = useState("med");
  
  const cambio_tam = (evento) => {
    let seleccion = evento.target.value;
    check_selection("peq", seleccion);
    check_selection("med", seleccion);
    check_selection("gra", seleccion);
    SetTam(seleccion);
  };

  const get_tam = () => {

    let tam_empresa = "";
    switch(tam){
      case "peq":
        tam_empresa = "Empresa pequeña (-100 empleados)";
        break;

      case "med":
        tam_empresa = "Empresa mediana (entre 100 y 200 empleados)";
        break;

      case "gra": 
        tam_empresa = "Empresa grande (+200 empleados)"
        break;
    }

    props.callback_registro_tam_empresa(tam_empresa);
  };

  return (
    <div>
    <Radio.Group value={tam} onChange={cambio_tam} style={{ width: "100%" }}>
      <Row gutter={50} style={{ width: "60%", margin: "auto" }}>
        <Col span={8} id="col_peq" style={{ margin: "auto" }}>
          <Radio.Button value="peq" style={{backgroundImage: "url('icono_empresa_pequena.png')", marginLeft: "4em",
            backgroundSize: "cover", width: "40px", height: "40px", border: "0.5px solid #753696"}}></Radio.Button>
        </Col>
          
        <Col span={8} id="col_med" style={{ margin: "auto" }}>
          <Radio.Button value="med" style={{backgroundImage: "url('icono_empresa_mediana.png')", marginLeft: "3em",
            backgroundSize: "cover", width: "80px", height: "80px", border: "0.5px solid #753696"}}></Radio.Button>
        </Col>
          
        <Col span={8} id="col_gra" style={{ margin: "auto" }}>
          <Radio.Button value="gra" style={{backgroundImage: "url('icono_empresa_grande.png')", marginLeft: "4em", 
            backgroundSize: "cover", width: "40px", height: "40px", border: "0.5px solid #753696"}}></Radio.Button>
        </Col>
      </Row>
    </Radio.Group>

    <Row gutter={50} style={{ width: "60%", marginLeft: "auto", marginRight: "auto", marginTop: "2em" }}>
      <Col span={8} style={{ margin: "auto", lineHeight: "1.3em", textAlign: "center" }}>
        <p><strong>Pequeña</strong></p>
        <p>-100 empleados</p>
      </Col>
        
      <Col span={8} style={{ margin: "auto", lineHeight: "1.3em", textAlign: "center" }}>
        <p><strong>Mediana</strong></p>
        <p>[100,200] empleados</p>
      </Col>
        
      <Col span={8} style={{ margin: "auto", lineHeight: "1.3em", textAlign: "center" }}>
        <p><strong>Grande</strong></p>
        <p>+200 empleados</p>
      </Col>
    </Row>

    <Col xs={{ offset: 0 }} sm={{ offset: 8, span: 24/3 }} style={{ padding: "0em" }} >
      <Button type="default" style={{ backgroundColor: "#83AD6C", marginTop: "2em", color: "black", width: "100%" }} 
        onClick={get_tam}>Continuar</Button>
    </Col>
  </div>
  );
};
export default Selector_tamano_empresa;