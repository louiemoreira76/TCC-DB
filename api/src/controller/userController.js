import { loginCliente, loginAdmin, Novocliente, MudarSenhaAdm } from '../Repository/userRepository.js';

import { Router } from "express";
const server = Router();

import passwordValidator from 'password-validator';//import

var schema = new passwordValidator(); // cria uma instância de um objeto chamado schema, Esse objeto schema é usado para definir e aplicar regras de validação personalizadas a senhas.

schema
    .is().min(10) // Mínimo de 10 caracteres
    .has().uppercase() // Pelo menos uma letra maiúscula
    .has().digits() // Pelo menos um dígito numérico
    .has().symbols(); // Pelo menos um caractere especial

server.post('/usuario/login', async (req, resp) => {
    try{
        const { email, senha } = req.body;

        const resposta = await loginCliente(email, senha);

        if (!resposta){
            throw new Error('Credenciais invalidas');
        }
        
        resp.send(resposta)
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.post(`/admin/login`, async (req, resp) => {
    try{
        const { email, senha, codigo } = req.body;

        const resposta = await loginAdmin(email, senha, codigo);

        if (!resposta){
            throw new Error('Credenciais invalidas');
        }

        resp.send(resposta)
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.post('/usuario/cadastrar', async (req, resp) => {
    try{
        const usuarioInserir = req.body;

        const Inserindo = await Novocliente(usuarioInserir)

        resp.send(Inserindo);
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/admin/NewSenha/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const senha = req.body;

        if(!id){
            resp.status(400).send({ erro: 'Adiministrador não logado'});
        }

        if(!senha){
            resp.status(400).send({ erro: 'senha obrigatoria!'});
        }

        if (schema.validate(senha)) { //!!!!!!!!!!!!!!!!!!!!!!
            resp.status(400).send({ erro: 'A nova senha não atende aos requisitos de segurança.' });
            return;
        }

        const resposta = await MudarSenhaAdm(senha, id);

        if (resposta !== 1)
            throw new Error('senha não pode ser alterada!')

        else
        resp.sendStatus(204);
    }
    catch(err){
        resp.status(500).send({
            erro: err.message
        });
    }
})

export default server;