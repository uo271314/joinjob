import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const decorador_rutas = Clase_envuelta => props => {
    
    const parametros = useParams();
    const rutas = useNavigate();

    return(
        <Clase_envuelta 
            { ...props }
            parametros = { parametros }
            rutas = { rutas }
        />
    );

}

export default decorador_rutas;