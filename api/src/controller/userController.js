import { loginCliente, loginAdmin, Novocliente, MudarSenhaAdm, MudarSenhaUser, InserirFotoPerfil, TudoCliente, TrocarFoto } from '../Repository/userRepository.js';
import multer from 'multer'; //img DB
const upload = multer({dest: 'tools/profile_images'});

import { Router } from "express";
const server = Router();

import passwordValidator from 'password-validator';//import

var schema = new passwordValidator(); // cria uma instância de um objeto chamado schema, Esse objeto schema é usado para definir e aplicar regras de validação personalizadas a senhas.

schema
    .is().min(10, 'Para a mudar a senha tem que ter no mínimo 10 caracteres!') // Mínimo de 10 caracteres
    .is().max(300,'Limite de 300 caracteres') 
    .has().uppercase(1, 'Para a mudar a senha tem que ter no mínimo 1 letra maiúscula!') // Pelo menos uma letra maiúscula
    .has().digits(1, 'Para a mudar a senha tem que ter no mínimo 1 número!') // Pelo menos um dígito numérico
    .has().not().spaces(true, 'Não pode haver espaços na senha!') //Sem espaços            
    .has().symbols(1, 'Para a mudar a senha tem que ter no mínimo 1 caractere especial'); // Pelo menos um caractere especial     
    //console.log(schema.validate(''));
    //console.log(schema.validate('K@1BHBHBH', { details: true }));
   // console.log(schema.validate('', { list: true }));

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

server.put('/usuario/New/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, telefone } = req.body;

        if (!id) {
            throw new Error('O usuário não está logado!');
        }

        const resposta = await MudarSenhaUser({ nome, email, senha, telefone }, id);

        if (!resposta) {
            resp.status(400).send({ erro: 'A alteração dos campos não foi executada!' });
        } else {
            resp.sendStatus(204);
        }
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});

server.put('/usuario/:id/imagens', upload.array('imagens', 5), async (req, resp) => {
    try{
        const {id} = req.params;
        const imagens = req.files.map(file => file.path);

        if (!imagens || imagens.length === 0){
            throw new Error('Escolha sua foto de perfil!')
        }

        if (id === 0 || id === null) {
            throw new Error('Você não está logado!')
        }

        const resposta = await InserirFotoPerfil(imagens[0], id);
        console.log({resposta});

        if(resposta != 1)
            throw new Error('A imagem não pode ser salva!')

        resp.status(204).send();
    }
    catch(err){
        console.log(err);
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/usuario/:id/mudar', upload.array('imagens', 5), async (req, resp) => {
    try{
        const {id} = req.params;
        const imagens = req.files.map(file => file.path); // Array de arquivos de imagem, por isso files

        if (!imagens || imagens.length === 0){
            throw new Error('Precisa escolher pelo menos uma imagem!')
        }

        const resposta = await TrocarFoto(id, imagens[0]);
        console.log({resposta});

        if(resposta != 1)
        throw new Error('A imagem não pode ser salva!')

        resp.status(204).send();
    }
    catch(err){
        console.log(err);
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/usuario/:id', async (req, resp) => {
    try{
        const { id } = req.params

        if (!id) {
            resp.status(400).send({ erro: 'O parâmetro "id" é obrigatório.' });
            return;
        }

        const resposta = await TudoCliente(id);

        if (!resposta) {
            resp.status(404).send([]);
        } else {
            resp.send(resposta);
        }
    } catch (err) {
        resp.status(500).send({
            erro: err.message
        });
    }
});

server.put('/admin/NewSenha/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const novaSenha = req.body;

        if(!id){
            resp.status(400).send({ erro: 'Adiministrador não logado'});
        }

        if(!novaSenha.senha){
            throw new Error('Senha obrigatória')
        }

        let errosSenha = schema.validate(novaSenha.senha, { list: true })

        if (errosSenha.length != 0) { //!!!!!!!!!!!!!!!!!!!!!!

            for(let item of errosSenha) {
                throw new Error(`${item.message}`)
            }
          

        }
        //[ 'min', 'uppercase', 'digits', 'spaces', 'symbols' ]
   
        const resposta = await MudarSenhaAdm(novaSenha.senha, id);

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