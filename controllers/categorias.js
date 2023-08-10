//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');
const Categoria = require('../models/categoria');

const crearCategoria = async (req = request, res= response) => {

    const nombre = req.body.nombre.toUpperCase();

    categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg:"La categoria ya existe"
        })
    }

    const data = {
        nombre,
        usuario: req.usuarioLogueado._id /*Aca es "_id" y no "uid", porque uid es cuando se 
                                        llama al metodo toJSON, que es el que sobreescribimos
                                        y es el que se llama cuando referenciamos al objeto
                                        completo y no a una propiedad en especil.*/
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json({
        msg:'Post'
        ,categoria
    })
}

// obtenerCategorias, con paginado, llamar populate de mongoose, (muestra info de usaurio asociado)
const obtenerCategorias = async (req = request, res= response) => {

    const {desde = 0, limite = 5} = req.query;
    const query = {estado:true};

    const [categorias, cantRegistros, cantRegistrosActivos] = await Promise.all([
        Categoria.find()
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
        Categoria.countDocuments(),
        Categoria.countDocuments(query)
    ]);

    res.json({
        "Registros en la colección:":cantRegistros,
        "Registros activos en la colección:": cantRegistrosActivos,        
        categorias
    });

}

const obtenerCategoria = async (req = request, res= response) => {

    const {id} = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');     

    res.json({
        categoria
    });
}

// actualizarCategoria: solamente el nombre, que no exista
const actualizarCategoria = async (req = request, res= response) => {

    const {id} = req.params;

    //Aca desestrucuturo todas las propiedades que me pueden mandar y no son
    //actualizables. Solo dejo es "resto" lo que quiero actualizar
    const {_id /*Nota 1*/, estado, ...resto} = req.body;

    /*
    -Nota 1
    Si me mandan esta propiedad, no la puedo llevar a mongo, ya que no es de tipo ObjectId y genera error.
    Exluyendola nos evitamos codificaion innecesaria. A lo sumo podemos gener un error 400 informado que
    esta propiedad no debe ser enviada.
    */

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuarioLogueado._id;

    const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })
        .populate('usuario','nombre');

    res.json({
        categoria
    });
}

// : borrado logico, con admin_role
const borrarCategoria = async (req = request, res= response) => {

    const {id} = req.params;
    const usuarioLogueado = req.usuarioLogueado;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, { new: true });         

    res.json({
        categoria,
        usuarioLogueado
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}