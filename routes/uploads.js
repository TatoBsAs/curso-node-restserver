//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { 
    cargarArchivo,
    actualizarImgColeccion,
    servirImgColeccion,
    actualizarImgColeccioncloudinary
 } = require('../controllers/uploads');

//Para validaciones
const {check} = require('express-validator');

//Importo middleware de validacion
const { validarCampos } = require('../middlewares/validar-campos');
const { hayArchivoAdjunto } = require('../middlewares/validar-si-adjunta-archivo');


const {esColeccionPermitida} = require('../helpers/db-validaciones')

//ACA EMPIEZA RUTEO!!!

//Subir un archivo cualquiera
router.post('/',cargarArchivo);


//Actualizar la imagen de una coleccion
router.put('/:coleccion/:id',
    [
    hayArchivoAdjunto,        
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => esColeccionPermitida(c, ['usuario', 'producto'])),
    validarCampos
    ], /*actualizarImgColeccion*/ actualizarImgColeccioncloudinary)

//Servir imagenes
router.get('/:coleccion/:id',
    [
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom(c => esColeccionPermitida(c, ['usuario', 'producto'])),
    validarCampos
    ],
    servirImgColeccion)


module.exports = router;