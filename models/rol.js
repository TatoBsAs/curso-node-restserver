const {Schema, model} = require('mongoose');

const roleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligatorio']
    }
})

//Forma de exportar con Mongoose. La funcion recibe 2 parametros: Nombre de la colección, como la usaremos en
//la importacion y el esquema asociado.
/*
IMPORTANTE!!!
1) El nombre de la coleccion debe ser igual al de la base menos la "s"
Ejemplos:
    Coleccion en base:  Usuarios        --> Nombre en Node: Usuario
    Coleccion en base:  Roles           --> Nombre en Node: Role
    Coleccion en base:  Comprobantes    --> Nombre en Node: Comprobante

2) El nombre del esquema, debe ser igual "nombre coleccion sin s y en minuscula" + "Schema"
*/
module.exports = model('Role', roleSchema );