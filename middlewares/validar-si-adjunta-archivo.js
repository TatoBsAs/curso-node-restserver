const { response } = require("express")

const hayArchivoAdjunto = (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json(
            {msg: 'No hay archivo/s en la petición'}
        );
    }

    next();
}

module.exports = {
    hayArchivoAdjunto   
}