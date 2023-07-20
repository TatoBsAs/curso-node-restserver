const {Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    imagen: {
        type: String
    },
    rol: {
        type: String,
        required: [true, 'El ROL es obligatorio'],
        enum: ['ADMIN_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },    
})

//IMPORTANTE!!!
/*
Truco para no devolver todo el documento que esta en la coleccion. Se sobreescribe el metodo toJson
desagregando los campos que no queremos hacer visibles para el frontend y dejando los  que si, en nuevo
objeto con el operador rest (...)

*/
usuarioSchema.methods.toJSON = function() {
    const {contraseña, __v, ...usuario /*operador rest (...nombreObjeto): crea objeto nombreObjeto
                                         con todos los campos no desagregados */} = this.toObject();
    return usuario;
}

//Forma de exportar con Mongoose. La funcion recibe 2 parametros: Nombre de la colección, como la usaremos en
//la importacion y el esquema asociado.
//IMPORTANTE El nombre de la coleccion debe ser igual al de la base menos la "s"
/*
IMPORTANTE!!!
1) El nombre de la coleccion debe ser igual al de la base menos la "s"
Ejemplos:
    Coleccion en base:  Usuarios        --> Nombre en Node: Usuario
    Coleccion en base:  Roles           --> Nombre en Node: Role
    Coleccion en base:  Comprobantes    --> Nombre en Node: Comprobante

2) El nombre del esquema, debe ser igual "nombre coleccion sin s y en minuscula" + "Schema"
*/
module.exports = model('Usuario', usuarioSchema);