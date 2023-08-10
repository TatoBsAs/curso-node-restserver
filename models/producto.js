const {Schema, model} = require('mongoose');

const productoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique:true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true
    },
    precio: {
        type: Number,
        default: 0.00
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required:true
    },
    descripcion: {type:String},
    disponible:{
            type:Boolean,
            default:true
    }
})

//IMPORTANTE!!!
/*
Truco para no devolver todo el documento que esta en la coleccion. Se sobreescribe el metodo toJson
desagregando los campos que no queremos hacer visibles para el frontend y dejando los  que si, en nuevo
objeto con el operador rest (...)

*/
productoSchema.methods.toJSON = function() {
    const {__v, ...producto /*operador rest (...nombreObjeto): crea objeto nombreObjeto
                                         con todos los campos no desagregados */} = this.toObject();
    
    return producto;
}

module.exports = model('Producto', productoSchema );