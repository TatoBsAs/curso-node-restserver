const Role = require('../models/rol');
const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const esRoleValido = async (rol = '') => {

    const rolValido = await Role.findOne({rol});

    if (!rolValido) {
            throw new Error(`El Rol ${rol} no está registrado en la BD.`);
    }

}

/*const existeCorreo = await Usuario.findOne({correo: usuario.correo});
if (existeCorreo) {
    return res.status(400).json({
        msg: `Error: Ya existe correo ${usuario.correo}`
    });
}*/

const existeCorreo = async (correo = '') => {

    const existe = await Usuario.findOne({correo});

    if (existe) {
            throw new Error(`El Correo ${correo} ya ha sido utilizado.`);
    }
}

const existeUusuarioById = async (id = '') => {
    const existe = await Usuario.findById(id);

    if (!existe) {
            throw new Error(`No se ha encontrado usuario con ID: ${id}`);
    }
}

const existeCategoriaById = async (id = '') => {
    const existe = await Categoria.findById(id);

    if (!existe) {
            throw new Error(`No se ha encontrado categoria con ID: ${id}`);
    }
}

const existeProductoById = async (id = '') => {

    const existe = await Producto.findById(id);

    if (!existe) {
            throw new Error(`No se ha encontrado producto con ID: ${id}`);
    }
}

const esColeccionPermitida = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error (`La coleccion ${coleccion} no es permitida. Se admite: ${colecciones}`);
    }

    return true

}

module.exports = {
    esRoleValido,
    existeCorreo,
    existeUusuarioById,
    existeCategoriaById,
    existeProductoById,
    esColeccionPermitida
}