//para manejar request y response, no uso todo express, solo las instancias
const {request, response, query} = require('express');

//Para encriptar
const bcryptjs = require('bcryptjs');

//En la importacion, el esquema se declara con mayuscula como estandar. Ya que el mismo es implementado como una clase, que luego se instancia.
const Usuario = require('../models/usuario');

//Para validaciones. Comento y llevo a funcion generica
//const { validationResult } = require('express-validator');


const usuariosPost = async (req = request, res= response) => {

    //Ejemplo de procesar json
    /*
    const {nombre = 'No informado', correo = 'No informado'} = req.body;

    res.json({
        msg: ' Put API from Controller',
        nombre,
        correo
    });
    */

    //IMPORTANTE!!!
    /*
    Al instanciar no solo se genera la instancia de clase, podemos pasar body como parametro y
    mongoose se encarga solo de parsear las propiedades del esquema y body.
    Si todo va bien, como no se definio un id en els esquema, a la clase se le agrega un campo _id 
    autogenerado por mongo
    */
    const usuario = new Usuario(req.body);
    //try{


        //Verificar si correo
        //Formato correcto. Aca se valida si se detectaron errores en el middleware de la ruta
        /*
        //Se comenta y se lleva a una funcion generica
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json(errores);
        }
        */



        //Ya existe?
        //Comento funcionalidad basica. Llevo control a funcion generica db-validaciones
        /*
        const existeCorreo = await Usuario.findOne({correo: usuario.correo});
        if (existeCorreo) {
            return res.status(400).json({
                msg: `Error: Ya existe correo ${usuario.correo}`
            });
        }
        */

        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();    /*Por defecto es 10 . Cantidad de "vueltas al encriptado", cuanto 
                                                mas grande nro, mas seguro. Pero tarda mas por lo que conviene un
                                                valor intermedio y el valor por defecto esta bien */
        
        usuario.contraseña = bcryptjs.hashSync(usuario.contraseña, salt);
        
        
        //Guarda en la base
        await usuario.save();
    
        res.json({
            msg: ' Put API from Controller',
            usuario 
        });
    /*} catch(e){
        console.log(e);

        res.json({
            msg: 'Error!!!',
            e
        });        
    }*/
}

const usuariosPut = async (req = request, res= response) => {

    const {id} = req.params;
    const {_id, /*Nota 1*/ correo, google, ...resto} = req.body;

    /*
    -Nota 1
    Si me mandan esta propiedad, no la puedo llevar a mongo, ya que no es de tipo ObjectId y genera error.
    Exluyendola nos evitamos codificaion innecesaria. A lo sumo podemos gener un error 400 informado que
    esta propiedad no debe ser enviada.
    */

    if (resto.contraseña) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.contraseña = bcryptjs.hashSync(resto.contraseña, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto); 

    res.json({
        msg: ' Put API from Controller',
        usuario
    });
}

const usuariosGet =async  (req = request, res = response) => {

    /*
    //Ejemplo Basico. Lo comento y hacemos el del video 135, Seccion 9
    const {name = "no iformado", lastname = "no iformado", edad = "no iformada"} = req.query

    res.status(201).json({
        msg: ' Get API from Controller',
        name, 
        lastname,
        edad
    });
    */

    //Trae todos
    //const usuarios = await Usuario.find();

    //Trae los primieros N, en este caso 3
    //const usuarios = await Usuario.find().limit(3);

    //Trae los que pidamos por parametro. Si no manda parametro definimos in default. En este caso 5
    //const {limite = 5} = req.query;
    //const usuarios = await Usuario.find().limit(Number(limite));

    /*
    COMENTO ESTE EJEMPLO BASICO Y REEMPLAZO POR USO DE "Promise.all"
    //Paginacion: Pedimos desde cual (segun un orden, por defecto estar ordenados por ID), cuandos (limite)
    const {desde = 0, limite = 5} = req.query;
    const usuarios = await Usuario.find()
                        .skip(Number(desde))
                        .limit(Number(limite));

    const cantRegistros = await Usuario.countDocuments();
    //Filtrado basico:
    //const cantRegistrosActivos = await Usuario.countDocuments({estado:true});    
    //Filtrado por query
    const query = {estado:true};
    const cantRegistrosActivos = await Usuario.countDocuments(query);

    res.json({
        "Registros en la colección:":cantRegistros,
        "Registros activos en la colección:": cantRegistrosActivos,        
        usuarios
    });
    */    

    /*
    "Promise.all"
    Como las consultas a la base son independientes una de otras se pueden lanzar en paralelo, para ell
    se usa el promise.All en el cual se manda un arreglo de promesas.
    Se desestrucutura el arreglo para opbener la respuestra de cada promesa
    */

    const {desde = 0, limite = 5} = req.query;
    const query = {estado:true};

    const [usuarios, cantRegistros, cantRegistrosActivos] = await Promise.all([
        Usuario.find()
            .skip(Number(desde))
            .limit(Number(limite)),
        Usuario.countDocuments(),
        Usuario.countDocuments(query)
    ]);

    res.json({
        "Registros en la colección:":cantRegistros,
        "Registros activos en la colección:": cantRegistrosActivos,        
        usuarios
    });    

}

const usuariosDelete = async (req, res= response) => {
    
    const {id} = req.params;

    //Borrado Fisico
    //const usuario = await Usuario.findByIdAndDelete(id);

    //Borrado Logico
    //IMPORTANTE:   findByIdAndUpdate devuelve la foto del objeto antes de ubdatear. Si quremos foto 
    //              post update, agregar tercer paramentro { new: true }
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false}, { new: true });     

    res.json({
        msg: ' Delete API from Controller',
        usuario
    });    
}

const usuariosPatch = (req, res) => {
    res.json(' Patch API from Controller');
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}