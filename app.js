//import 'dotenv/config';
require('dotenv').config();
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';

//IMPORTANTE: Las importaciones locales van ultimo.
// 01 - Primero las incluidas en Node como
// 02 - Segundo, la de los paquetes instalados
// 03 - Tercero, las creas por nosotros

const Server = require('./models/Server');

const server = new Server();

server.listen();