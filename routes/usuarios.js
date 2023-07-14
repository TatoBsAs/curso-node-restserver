//para manejar rutas, no uso todo express, solo la clase Router
const {Router} = require('express');
//Importo los controladores, para usarlos como referencias, no se invocan!!
const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet /*No va (), ya que no estamos invocando la funcion, sino que la estamos pasando por referencia */);

router.put('/:id', usuariosPut);

router.post('/', usuariosPost);

router.delete('/', usuariosDelete);        

router.patch('/', usuariosPatch);

module.exports = router;