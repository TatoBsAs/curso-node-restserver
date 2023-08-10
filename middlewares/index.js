
//Al llamarlo index no es necesario poner el nombre en la importacion

const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-JWT');
const validaRole = require('../middlewares/validar-role');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRole
}