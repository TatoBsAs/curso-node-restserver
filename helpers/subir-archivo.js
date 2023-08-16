const path = require ('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesPermitidas = ['jpg', 'png', 'jpeg', 'gif'], subCarpeta = '') => {

    return new Promise ( (resolve, reject) => {

        //Aca analizo si esta mi propiedad "archivo"
        if (!files.archivo) {
            return reject('No hay propiedad "archivo" en la petición');
        }

        //Si vino "archivo" lo desestructuro
        const {archivo} = files;

        //VAlido extension
        //INI
        let extension = archivo.name.split('.');
        
        extension = extension[extension.length - 1].toLowerCase(); //Ojo, los controles de nombre son "casesentitive"

        if (!extensionesPermitidas.includes(extension)) {
            return reject(`Tipo de arhivo (${extension}) no permitido. Debe ser de tipo: ${extensionesPermitidas}`);
        }
        //FIN

        //Le doy nuevo nombre con uuid
        const nuevoNombre = uuidv4() + '.' + extension;

        //tomo ruta donde subir archivos
        uploadPath = path.join(__dirname, '../arhivosSubidos/',subCarpeta , nuevoNombre);

        //muevo archivo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(/*uploadPath*/ nuevoNombre);
        });

    });
}

module.exports = {
    subirArchivo
}