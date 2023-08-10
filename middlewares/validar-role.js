const { request, response } = require('express');

const esAdmin = (req = request, res = response, next) => {

    if (!req.usuarioLogueado) {
        return res.status(500).json({
            msg: `No se llamo antes a middleware de validar Token`
        });
    }

    if (req.usuarioLogueado.rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `Usuario no tiene Rol Administrador`
        });
    }

    next();
}

const tieneRol = (...resto) => { /*...resto pone todos lo argumentos que se pasen en un arreglo llamado resto*/
    return (req = request, res = response, next) => {

        //console.log(resto);
        
        if (!req.usuarioLogueado) {
            return res.status(500).json({
                msg: `No se llamo antes a middleware de validar Token`
            });
        }

        //console.log(req.usuarioLogueado.rol);

        if (!resto.includes(req.usuarioLogueado.rol)){
            return res.status(401).json({
                msg: `Usuario logueado con rol ${req.usuarioLogueado.rol}. No tiene alguno de estos roles: ${resto}`
            });           
        }

        next();
    }
}



module.exports = {
    esAdmin,
    tieneRol   
}