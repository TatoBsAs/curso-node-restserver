//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');
const Producto = require('../models/producto');

const crearProducto = async (req = request, res= response) => {

    const {nombre, estado, usuario, precio, categoria, descripcion, disponible} = req.body;

    //nombre = nombre.toUpperCase();

    productoDB = await Producto.findOne({
        nombre: nombre.toUpperCase()
    });

    if(productoDB) {
        return res.status(400).json({
            msg:"El producto ya existe"
        })
    }

    const data = {
        nombre: nombre.toUpperCase(),
        estado,
        usuario: req.usuarioLogueado._id, /*Aca es "_id" y no "uid", porque uid es cuando se 
                                        llama al metodo toJSON, que es el que sobreescribimos
                                        y es el que se llama cuando referenciamos al objeto
                                        completo y no a una propiedad en especil.*/
        precio,
        categoria,
        descripcion,
        disponible                                                
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json({
        producto
    })
}

const obtenerProductos = async (req = request, res= response) => {

    const {desde = 0, limite = 5} = req.query;
    const query = {estado:true};

    const [productos, cantRegistros, cantRegistrosActivos] = await Promise.all([
        Producto.find()
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
        Producto.countDocuments(),
        Producto.countDocuments(query)
    ]);

    res.json({
        "Registros en la colección:": cantRegistros,
        "Registros activos en la colección:": cantRegistrosActivos,        
        productos
    });
}

const obtenerProductoById = async (req = request, res= response) => {

    const {id} = req.params;
    const producto = await Producto.findById(id)
                                .populate('usuario', 'nombre')
                                .populate('categoria', 'nombre');

    res.json({
        producto
    });
}

const actualizarProducto = async (req = request, res= response) => {

    const {id} = req.params;

    //Aca desestrucuturo todas las propiedades que me pueden mandar y no son
    //actualizables. Solo dejo es "resto" lo que quiero actualizar
    const {_id /*Nota 1*/, estado, usuario, disponible, ...resto} = req.body;

    /*
    -Nota 1
    Si me mandan esta propiedad, no la puedo llevar a mongo, ya que no es de tipo ObjectId y genera error.
    Exluyendola nos evitamos codificaion innecesaria. A lo sumo podemos gener un error 400 informado que
    esta propiedad no debe ser enviada.
    */

    if (resto.nombre) {
        resto.nombre = resto.nombre.toUpperCase();
    }
    resto.usuario = req.usuarioLogueado._id;

    const producto = await Producto.findByIdAndUpdate(id, resto, { new: true })
        .populate('usuario','nombre')
        .populate('categoria','nombre');

    res.json({
        producto
    });
}

const borrarProducto = async (req = request, res= response) => {

    const {id} = req.params;
    const usuarioLogueado = req.usuarioLogueado;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, { new: true });         

    res.json({
        producto,
        usuarioLogueado
    });
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    borrarProducto
}