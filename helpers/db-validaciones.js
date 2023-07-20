const Role = require('../models/rol');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRoleValido,
    existeCorreo,
    existeUusuarioById
}