//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { 
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
 } = require('../controllers/categorias');

//Para validaciones
const {check} = require('express-validator');

//Importo middleware de validacion
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares');
const { tieneRol } = require('../middlewares');

const { existeCategoriaById } = require('../helpers/db-validaciones');

//ACA EMPIEZA RUTEO!!!

//CREATE
router.post('/',
        [
        validarJWT,
        check('nombre','Debe suministrar un nombre.').not().isEmpty(),
        validarCampos
        ],
        crearCategoria
);


//READ
router.get('/', obtenerCategorias);

//Get categoria por id, validad que el id exista  con nueva funcion existeCategoria
router.get('/:id', 
    [
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
    ],
    obtenerCategoria
);

//UPDATE
router.put('/:id', 
    [
    validarJWT,
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
    ],
    actualizarCategoria
);

//DELETE
router.delete('/:id', 
    [
    validarJWT,
    tieneRol('ADMIN_ROLE'/*, 'VENTA_ROLE'*/),
    check('nombre','Debe suministrar un nombre.').not().isEmpty(),    
    check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
    ],
    borrarCategoria

    //NOTA!!
    /*
    Las validaciones de que el id se valido y que exista deberian hacerse por separado y no al mismo tiempo.
    Para hacer esto, se puede poner en el arreglo de middlewares primero la validacion de que es mongo id, luego llmar
    al validarCampos, luego a existeCategoriaById y luego nuevamente a validarCampos.
    El arreglo quedaria así:

    [
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('nombre','Debe suministrar un nombre.').not().isEmpty(),    
    check('id' , 'No es un ID valido').isMongoId(),
    validarCampos
    check('id').custom(existeCategoriaById),
    validarCampos
    ]

     */
);

module.exports = router;