const {Schema, model} = require('mongoose');

const categoriaSchema = Schema({
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
    }
})

//IMPORTANTE!!!
/*
Truco para no devolver todo el documento que esta en la coleccion. Se sobreescribe el metodo toJson
desagregando los campos que no queremos hacer visibles para el frontend y dejando los  que si, en nuevo
objeto con el operador rest (...)

*/
categoriaSchema.methods.toJSON = function() {
    const {__v, ...categoria /*operador rest (...nombreObjeto): crea objeto nombreObjeto
                                         con todos los campos no desagregados */} = this.toObject();
    
    return categoria;
}

module.exports = model('Categoria', categoriaSchema );