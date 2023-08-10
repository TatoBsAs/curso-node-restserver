//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Para validaciones
const {check} = require('express-validator');

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

//Importo middleware de validacion
//Dejo importacion basica como ejemplo, pero reemplazo por importacion reducida.
/*
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-JWT');
const { esAdmin, tieneRol } = require('../middlewares/validar-role');
*/

const {validarCampos, validarJWT, esAdmin, tieneRol} = require('../middlewares'); //Al llamarlo index no es necesario poner el nombre en la importacion



//Importo coleccion rol.
//Comento para dejar ejemplo basico. Pero en realidad debe ir en funcion generica (db-validaciones)
//const Role = require('../models/rol');
//Importo funcion generica de validaciones contra DB
const {esRoleValido, existeCorreo, existeUusuarioById} = require('../helpers/db-validaciones');



//ACA EMPIEZA RUTEO!!!
router.post('/', 
        /*
        Arreglo de middlewares para validar:
        Primero van los campos que se quieren validar y marcan los errores en el request y por ultimo
        se pone nuestro middleware casero que analizar errores.
        */
        [
        check('nombre','Nombre es requerido').not().isEmpty(),
        check('contraseña','Contraseña es Requerida. Minimo 7 caracteres.').isLength({min: 7}),
        check('correo','Formato de correo no válido').isEmail(),
        //Reemplazamos validacion comun por validacion personalizada. El efecto es el mismo, osea
        //se marca error en el Request y la validacion se hace en el middleware validarCampos
        //check('rol','Role no válido').isIn(['ADMIN_ROLE','USER_ROLE']),
        //Comento uso basico y llamo a funcion generica
        check('rol').custom( 
                /*
                async(rol = '') => {

                const rolValido = await Role.findOne({rol});

                if (!rolValido) {
                        throw new Error(`El Rol ${rol} no está registrado en la BD.`)
                }

                }*/

                esRoleValido    //la sintaxis seria (rol) => esRoleValido(rol), pero js, cuando una
                                //funcion de flecha recibe y pasa el mismo parametro se puede omitir
                                //quedando unicamnete el nombre de la funcion invocada
                ),
        check('correo').custom(existeCorreo),
        validarCampos
        ],
        usuariosPost /*No va (), ya que no estamos invocando la funcion, sino que la estamos pasando por referencia */);

router.put('/:id', 
        [
        check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
        check('id').custom(existeUusuarioById),
        check('rol').custom(esRoleValido),      /*En este caso estamos exigiendo manden Rol. Si queremos que se obtativo hay crear otra
                                                validacion. Que valide solo si lo mandan*/
        validarCampos
        ],
        usuariosPut /*No va (), ya que no estamos invocando la funcion, sino que la estamos pasando por referencia */);

router.get('/', usuariosGet/*No va (), ya que no estamos invocando la funcion, sino que la estamos pasando por referencia */);

router.delete('/:id', 
        [
        validarJWT,
        //esAdmin,
        tieneRol('ADMIN_ROLE', 'VENTA_ROLE'),
        check('id' /*express-validator se da cuenta si es una propiedad del body o un parametro*/, 'No es un ID valido').isMongoId(),
        check('id').custom(existeUusuarioById),
        validarCampos
        ],

        usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;