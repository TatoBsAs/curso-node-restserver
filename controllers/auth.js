//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');

//Modelo base de datos
const Usuario = require('../models/usuario');

//Para encriptar
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

//Para manejar Google
const {googleVerify} = require('../helpers/google-verify');


const authPost = async (req = request, res= response) => {

    const {correo, contraseña} = req.body;

    try {

        //Mail existe?
        const usuario = await Usuario.findOne({correo});

        if (!usuario) {
            return res.status(400).json({
                msg: `No existe usuario con el email ${correo}`
            });
        }

        //Usuario activo?
        if (!usuario.estado){
            return res.status(400).json({
                msg: `Usuario ${usuario.nombre} no Activo`
            });
        }

        //Contraseña correcta?
        if (!bcryptjs.compareSync(contraseña, usuario.contraseña)){
            return res.status(400).json({
                msg: `Contraseña incorrecta para Usuario ${usuario.nombre}`
            });
        }

        //Generar JWT
        const token = await generarJWT (usuario.id);

        res.json({
            msg: ' Login OK!!!',
            usuario,
            token
        });

    }catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:"Error interno",
            error
        })
    }
}

const googleSignIn = async (req = request, res= response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        //console.log(nombre, img, correo);

        let usuario = await Usuario.findOne({ correo})

        if (!usuario) {
            //Si usuario no existe lo creo
            const data = {
                nombre,
                correo,
                contraseña: ":p", //Se puede poner cualquier cosa, total nunca se va a validar
                imagen: img,
                google: true,
                rol:"USER_ROLE"
            };

            usuario = new Usuario(data);

            await usuario.save();
        }

        if(!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con Administrador. Usuario bloqueado."
            });
        }

       //Generar JWT
       const token = await generarJWT (usuario.id);

        res.json({
            msg:'Todo Ok',
            id_token,
            usuario,
            token            
        })

    }catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:"Error interno. No se pudo verificar Token",
            error
        })
    }
}

module.exports = {
    authPost,
    googleSignIn
}