import 'dotenv/config'
import { conx } from './connecion.js';

import express from 'express';
import cors from 'cors'

//import usuarioController from './controller/UsuarioController.js';
//import jogoController from './controller/jogoController.js';

const server = express();
server.use(cors());
server.use(express.json());


//server.use('/tools/image', express.static('tools/image'));


//server.use(usuarioController);
//server.use(filmeController);

server.listen(process.env.PORT, () => console.log(`API mucho loka Conectada! ${process.env.PORT}`));
