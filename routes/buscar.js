//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Importo middleware de validacion
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares');

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { 
    getBuscar
 } = require('../controllers/buscar');



//ACA EMPIEZA RUTEO!!!

router.get('/:coleccion/:datoABuscar', 
    [
    validarJWT,
    validarCampos
    ],
    getBuscar);

module.exports = router;