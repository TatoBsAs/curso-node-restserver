//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');

const usuariosGet = (req = request, res = response) => {

    const {name = "no iformado", lastname = "no iformado", edad = "no iformada"} = req.query

    res.status(201).json({
        msg: ' Get API from Controller',
        name, 
        lastname,
        edad
    });
}

const usuariosPut = (req, res= response) => {

    const {id} = req.params;

    res.json({
        msg: ' Put API from Controller',
        id
});
}

const usuariosPost = (req, res= response) => {

    //const {nombre, dni} = req.body;

    res.json({
        msg: ' Post API from Controller'//,
        //datosRecibidos: nombre + ' DNI: ' + dni 
    });
}

const usuariosDelete = (req, res= response) => {
    res.json(' Delete API from Controller');
}

const usuariosPatch = (req, res) => {
    res.json(' Patch API from Controller');
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}