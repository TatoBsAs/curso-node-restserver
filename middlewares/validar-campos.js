const { validationResult } = require('express-validator');

const validarCampos = (req, res, next /* Leer mas abajo */)=> {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json(errores);
    }

    //IMPORTEANTE:
    /* Como es un Midleware, tiene un tercer parametro que es una funcion (Por convecnion se llama next).
    Si fue todo bien con las validaciopnes, se debe llamar a dicha funcion, que es quien invoca siguiente Middleware.
    */ 
    next();
}

module.exports = {
    validarCampos
}