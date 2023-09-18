import { inserirProduto } from "../Repository/jogoRepository.js"

import { Router } from 'express';
const server = Router();

server.post('/produto', async(req, resp) => {
    try{
        const produtoParaInserir = req.body  

        if(!produtoParaInserir.nome)
            throw new Error('Nome do PRODUTO inserido é obrigatorio');

        if(!produtoParaInserir.preco)
        throw new Error('Sinopse do filme inserido é obrigatorio');

        if(!produtoParaInserir.precoPro)
            throw new Error('Avaliação do filme inserido é obrigatorio');

        if(!produtoParaInserir.destaque == undefined)
         throw new Error('Lançamento do filme inserido é obrigatorio');

         if(!produtoParaInserir.promocao == undefined)
         throw new Error('Disponivel do filme inserido é obrigatorio');
        
         if(!produtoParaInserir.disponivel == undefined)
         throw new Error('Disponivel do filme inserido é obrigatorio');
        
         if(!produtoParaInserir.qtd)
         throw new Error('Disponivel do filme inserido é obrigatorio');

         if(!produtoParaInserir.details)
         throw new Error('Disponivel do filme inserido é obrigatorio');

         if(!produtoParaInserir.categoria)
        throw new Error('Categoria não registrada')

        const RepositoryInseridoP = await inserirProduto(produtoParaInserir);
       
        resp.send(RepositoryInseridoP);
    }

    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})