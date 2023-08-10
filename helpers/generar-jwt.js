const jwt = require('jsonwebtoken');

const generarJWT = (uid /*user identifier */) => {
    return new Promise ((resolve, reject) =>  {

        const payLoad = {uid};

        jwt.sign(payLoad, process.env.KEY_PARA_JWT, {
            expiresIn: '4h' /*365d = 365 dias */
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el TOke');
            }else {
                resolve(token);
            }

        })
    })
}

module.exports = {
    generarJWT
}