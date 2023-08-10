//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');
const { isValidObjectId } = require('mongoose');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');
const categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'categoria',
    'producto',
    'rol',
    'usuario'    
]

const buscarUsuario = async (datoABuscar, res= response) => {

    const isMongoId = isValidObjectId(datoABuscar);

    if (isMongoId){

        const usuario = await Usuario.findById(datoABuscar)

        return res.json({
                resultados: (usuario) ? [usuario] : ['Dato no encontrado']
            });

    } 
    
    const expresionRegular = new RegExp (datoABuscar, 'i') //Esto es de js puro. i significa que no es sensible mayus/minus

    const usuarios = await Usuario.find({
        //Esto es Mongo (o mongoose) puro
        $or: [{nombre: expresionRegular}, {correo: expresionRegular}],
        $and: [{estado : true}]
    })

    return res.json({
        resultados: (usuarios.length === 0) ? ['Dato no encontrado'] : [usuarios]
    });

}

const buscarCategoria = async (datoABuscar, res= response) => {

    const isMongoId = isValidObjectId(datoABuscar);

    if (isMongoId){

        const categoria = await Categoria.findById(datoABuscar)

        return res.json({
                resultados: (categoria) ? [categoria] : ['Dato no encontrado']
            });

    } 
    
    const expresionRegular = new RegExp (datoABuscar, 'i') //Esto es de js puro. i significa que no es sensible mayus/minus

    const categorias = await Categoria.find({nombre: expresionRegular, estado : true})

    return res.json({
        resultados: (categorias.length === 0) ? ['Dato no encontrado'] : [categorias]
    });

}

const buscarProcuto = async (datoABuscar, res= response) => {

    const isMongoId = isValidObjectId(datoABuscar);

    if (isMongoId){

        const producto = await Producto.findById(datoABuscar)
                                    .populate('categoria','nombre');

        //Mejora: Si no encuentro producto veo si me mandan id de categoria
        /*
        return res.json({
            resultados: (producto) ? [producto] : ['Dato no encontrado']
        });
        */

        if (producto) {
            return res.json({
                resultados: (producto) ? [producto] : ['Dato no encontrado']
            });
    
        }else {

            const productos = await Producto.find({categoria: datoABuscar, estado : true}).populate('categoria','nombre');            

            return res.json({
                resultados: (productos.length === 0) ? ['Dato no encontrado'] : [productos]
            });
        }
    } 
    
    const expresionRegular = new RegExp (datoABuscar, 'i') //Esto es de js puro. i significa que no es sensible mayus/minus

    //Mejora, si no encuentro producto, veo si me mandan categorias
    /*
    const productos = await Producto.find({nombre: expresionRegular, estado : true}).populate('categoria','nombre');

    return res.json({
        resultados: (productos.length === 0) ? ['Dato no encontrado'] : [productos]
    });
    */

    let productos = await Producto.find({nombre: expresionRegular, estado : true}).populate('categoria','nombre');
    
    if (productos.length === 0) {

        const categorias = await Categoria.find({nombre: datoABuscar.toUpperCase()})
        
        if (categorias.length === 0) {
            return res.json({
                resultados: ['Dato no encontrado']
            });            
        }

        if (categorias.length >= 2) {
            return res.json({
                resultados: ['Se ha encontrado mas de una categoria que informar']
            });            
        }        

        /*
        return res.json({
            resultados: ['Vamos biennnnn']
        });        
        */

        productos = await Producto.find({categoria: categorias[0]._id, estado : true}).populate('categoria','nombre');

        return res.json({
            resultados: (productos.length === 0) ? ['Dato no encontrado'] : [productos]
        });        

    } else {
        return res.json({
            resultados: [productos]
        });        
    }

}

const getBuscar = async (req = request, res= response) => {

    const {coleccion = '', datoABuscar = ''} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categoria':
            buscarCategoria(datoABuscar, res);
        break;

        case 'producto':
            buscarProcuto(datoABuscar, res);            
        break;

        case 'usuario':
            buscarUsuario(datoABuscar, res);
        break;

        default:
            return res.status(500).json({
                msg: `No se ha implmentado busqueda por "${coleccion}"`
            });
    }
}

module.exports = {
    getBuscar
}