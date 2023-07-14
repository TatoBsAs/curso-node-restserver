const express = require('express');
const  cors = require('cors')

class Server {

    constructor(){
        //Las propiedades no se enumeran, sino que directamente se colocan en el constructor        
        this.app = express();
        this.port = process.env.PORT;

        //Defino como variable o constante, el path del archivo de rutas para usuarios
        this.usuariosPath = '/api/usuarios';

        //Middlewares
        this.middlewares();

        //Llamo a metodo que declara o inicializa los listeners, las rutas que seran
        // permitidas, los controladores de los reques
        this.routes();
    }

    //Aca se declaran los middlewares.
    middlewares() {

        //Habilitamos CORS
        this.app.use(cors());

        //Para que los metodos Put, Post, Delete puedan procesar Json
        this.app.use(express.json());

        //Servir la carpeta public, donde esta el website
        this.app.use(express.static('public'));
    }

    //Metodo donde se declaran todos los listeners o endpoints
    routes() {

        //Luego de crear el middlewares, esto ya no se ejecutra, ya que toma prioridad public
        //Pero si hay que generar los demas contoladores
        /*
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo!!!');
          })
        */


        //En un estandar, esto se separa en rutas y controladores. Por lo tanto comento y separo
        /*
        this.app.get('/api', (req, res) => {
            res.status(201).json(' Get API');
        })

        this.app.put('/api', (req, res) => {
            res.json(' Put API');
        })

        this.app.post('/api', (req, res) => {
            res.json(' Post API');
        })

        this.app.delete('/api', (req, res) => {
            res.json(' Delete API');
        })        

        this.app.patch('/api', (req, res) => {
            res.json(' Patch API');
        })
        */        

        //Aca inicializo las rutas, una por cada archivo de la carpeta routes
        this.app.use(this.usuariosPath, require('../routes/usuarios'))
    }

    //Metodo que inicia el sercer. Debe ser invocado luego de instanciar la clase
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerdo: ${this.port}`);
        })
    }
}

module.exports = Server;