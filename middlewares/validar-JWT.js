const Usuario = require('../models/usuario');

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    //console.log(token);

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    try {

        const {uid} = jwt.verify(token, process.env.KEY_PARA_JWT)

        //req.uid = uid;

        //const usuario = await Usuario.findOne({_id: uid});
        const usuario = await Usuario.findById (uid);
        if (!usuario) {
            return res.status(400).json({
                msg: `Usuario no econtrado`
            });
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg: `Usuario no Activo`
            });
        }

        req.usuarioLogueado = usuario;

        next();        
    }catch (error){
        //console.log(error);

        return res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}