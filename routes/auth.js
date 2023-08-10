//IMPORTACIONES!!!

//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
const router = Router();

//Importo los controladores, para usarlos como referencias, no se invocan!!
const { 
    authPost, googleSignIn
 } = require('../controllers/auth');

//Para validaciones
const {check} = require('express-validator');

//Importo middleware de validacion
const { validarCampos } = require('../middlewares/validar-campos');

 //ACA EMPIEZA RUTEO!!!
router.post('/login',
        [
        check('correo','Formato de correo no válido.').isEmail(),
        check('contraseña','La contraseña es obligatoria.').not().isEmpty(),
        validarCampos
        ],
        authPost
);

router.post('/google',
        [
        check('id_token','id_token es necesario').not().isEmpty(),
        validarCampos
        ],
        googleSignIn
);

module.exports = router;