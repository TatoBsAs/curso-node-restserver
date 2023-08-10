//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { 
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    borrarProducto    
 } = require('../controllers/productos');

//Para validaciones
const {check} = require('express-validator');

//Importo middleware de validacion
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdmin } = require('../middlewares');
const { existeProductoById, existeCategoriaById } = require('../helpers/db-validaciones');

//ACA EMPIEZA RUTEO!!!
//CREATE
router.post('/',
        [
        validarJWT,
        check('nombre','Debe suministrar un nombre.').not().isEmpty(),
        check('categoria','Debe suministrar una categoria.').not().isEmpty(),
        validarCampos,
        check('categoria' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
        validarCampos,
        check('categoria').custom(existeCategoriaById),
        validarCampos,
        ],
        crearProducto
);

//READ
router.get('/', obtenerProductos);

//Get categoria por id, validad que el id exista  con nueva funcion existeCategoria
router.get('/:id', 
    [
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos
    ],
    obtenerProductoById
);

//UPDATE
router.put('/:id',
    [
    validarJWT,
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos
    ],
    actualizarProducto
);

//DELETE
router.delete('/:id', 
    [
    validarJWT,
    esAdmin,
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    validarCampos,
    check('id').custom(existeProductoById),
    validarCampos
    ],
    borrarProducto
);

module.exports = router;