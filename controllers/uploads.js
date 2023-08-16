const path = require ('path');
const fs = require('fs');

const {subirArchivo} = require('../helpers/subir-archivo')

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//Cloudinary
const cloudinary = require('cloudinary').v2; //Importacion
cloudinary.config(process.env.CLOUDINARY_URL); //Me "logeo con mi usuarios"

//para manejar request y response, no uso todo express, solo las instancias
const {request, response} = require('express');

const cargarArchivo = async (req = request, res= response) => {

    let uploadPath = ''

    //Analizo si mandan archivos
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg: 'No hay archivo/s en la petición'});
        return;
    }

    //Aca analizo si esta mi propiedad "archivo"
    if (!req.files.archivo) {
        res.status(400).json({msg: 'No hay archivo/s en la petición'});
        return;
    }

    //Si vino "archivo" lo desestructuro
    const {archivo} = req.files;

    //Ejemplo basico. Lo cambio por Mejora
    /*
    //Creo ruta a donde mover el arhivo
    const uploadPath = path.join(__dirname, '../arhivosSubidos/', archivo.name);

    //Intento mover
    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({err});
        }

        return res.json({msg: `Archivo ${archivo.name} subido a ${uploadPath}`});
    });
    */

    //Mejora: veo si viene un solo archivo o un arreglo
    if (Array.isArray(archivo)) {

        archivo.forEach((element) => {
            //console.log(element)

            uploadPath = path.join(__dirname, '../arhivosSubidos/', element.name);

            element.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).json({err});
                }
            });            
        });

        return res.json({msg: `ArchivoSSSS!!! subidos correctamente a ${uploadPath}`});        

    }else{
        //console.log(archivo);
        uploadPath = path.join(__dirname, '../arhivosSubidos/', archivo.name);

        //VAlido extension
        //INI
        const extensionesPermitidas = ['jpg', 'png', 'jpeg', 'gif']
        let extension = archivo.name.split('.');
        
        
        extension = extension[extension.length - 1].toLowerCase(); //Ojo, los controles de nombre son "casesentitive"

        if (!extensionesPermitidas.includes(extension)) {
            return res.status(400).json({
                msg: `Tipo de arhivo (${extension}) no permitido. Debe ser de tipo: ${extensionesPermitidas}`
            });
        }
        //FIN

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).json({err});
            }
    
            return res.json({msg: `Archivo ${archivo.name} subido a ${uploadPath}`});
        });        
    }
}

const actualizarImgColeccion = async (req = request, res= response) => {

    const {coleccion, id} = req.params;
    let modelo;

    //Comento y llevo a midleware
    //Analizo si mandan archivos
    /*
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg: 'No hay archivo/s en la petición'});
        return;
    }
    */

    switch (coleccion) {
        case 'usuario':

            modelo = await Usuario.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Usuario con id: ${id}`})
            }

        break;

        case 'producto':

            modelo = await Producto.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Producto con id: ${id}`})
            }            
        break;

        default:
            return res.status(500).json({msg: 'Coleccion no manejadas. Hablar con administrador.'})
    }


    //Borro imagen anterior
    if (modelo.imagen) {
        const archivoABorrar = uploadPath = path.join(__dirname, '../arhivosSubidos/', coleccion , modelo.imagen);

        if (fs.existsSync(archivoABorrar)) {
            fs.unlinkSync(archivoABorrar);
        }
    }

    const nombre = await subirArchivo(req.files, undefined /*Es como mandar null en PB */, coleccion)
                        .catch(err => res.status(500).json({msg:err}));
    
    modelo.imagen = nombre;
    await modelo.save();
    res.json(modelo);
}

const servirImgColeccion = async (req = request, res= response) => {

    const {coleccion, id} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuario':

            modelo = await Usuario.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Usuario con id: ${id}`})
            }

        break;

        case 'producto':

            modelo = await Producto.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Producto con id: ${id}`})
            }            
        break;

        default:
            return res.status(500).json({msg: 'Coleccion no manejadas. Hablar con administrador.'})
    }


    //Borro imagen anterior
    if (modelo.imagen) {
        const archivo = uploadPath = path.join(__dirname, '../arhivosSubidos/', coleccion , modelo.imagen);

        if (fs.existsSync(archivo)) {
            return res.sendFile(archivo)
        }
    }

    //res.status(500).json({msg: 'No se ha encontrado archivo'});
    const archivo = uploadPath = path.join(__dirname, '../assets/no-image.jpg');
    return res.sendFile(archivo)
}

const actualizarImgColeccioncloudinary = async (req = request, res= response) => {

    const {coleccion, id} = req.params;
    let modelo;

    //Comento y llevo a midleware
    //Analizo si mandan archivos
    /*
    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({msg: 'No hay archivo/s en la petición'});
        return;
    }
    */

    switch (coleccion) {
        case 'usuario':

            modelo = await Usuario.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Usuario con id: ${id}`})
            }

        break;

        case 'producto':

            modelo = await Producto.findById(id);

            if (!modelo){
                return res.status(400).json({msg:`No se encontro Producto con id: ${id}`})
            }            
        break;

        default:
            return res.status(500).json({msg: 'Coleccion no manejadas. Hablar con administrador.'})
    }

    //Borro imagen anterior
    if (modelo.imagen) {
        
        //Transformo el link en un arreglo, separando elementos por /
        let archivoABorrar = modelo.imagen.split('/');

        //Del arreglo me quedo con el ultimo elemento, el cual es el nombre del archivo con su extension
        archivoABorrar = archivoABorrar[archivoABorrar.length - 1];

        //Del nombre + extension, tomo solo el nombre, desestrucutrando el arreglo y tomando el primer elemento unicamente
        [archivoABorrar] = archivoABorrar.split('.');

        cloudinary.uploader.destroy(archivoABorrar); //no es necesario que lleve el "await" ya que no necesitamos esperar respuesta
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    modelo.imagen = secure_url;
    await modelo.save();
    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    actualizarImgColeccion,
    servirImgColeccion,
    actualizarImgColeccioncloudinary    
}