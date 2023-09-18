import { inserirProduto, todosJogos, alterarProduto, deletarProduto } from "../Repository/jogoRepository.js"

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

server.get('/produtos', async (req, resp) => {
    try{
        const resposta = await todosJogos();
        resp.send(resposta)
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/produto/:id', async (req, resp) => {
    try{
        const { id } = req.params;
        const produto = req.body;

        if(!produto.nome)
        throw new Error('Nome do produto inserido é obrigatorio');

        if (!produto.preco)
        throw new Error('Preço do produto inserido é obrigatório');

        if (!produto.precoPro)
        throw new Error('Preço promocional do produto inserido é obrigatório');

        if (produto.destaque === undefined)
        throw new Error('Campo destaque do produto inserido é obrigatório');

        if (produto.promocao === undefined)
        throw new Error('Campo promoção do produto inserido é obrigatório');

        if (produto.disponivel === undefined)
        throw new Error('Campo disponível do produto inserido é obrigatório');

        if (!produto.qtd)
        throw new Error('Quantidade em estoque do produto inserido é obrigatória');

        if (!produto.details)
        throw new Error('Detalhes do produto inserido são obrigatórios');

        if (!produto.admin)
        throw new Error('O adiministrador não existe');

        const resposta = await alterarProduto(id, produto);

        if (resposta !== 1)
        throw new Error('Produto não pode ser alterado!')

        else
            resp.status(204).send();
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/produto/:id', async (req, resp) => {
    try{
        const { id } = req.params;

        const resposta = await deletarProduto(id);

        if(resposta != 1)
            throw new Error('Produto não pode ser removido!');

        resp.status(204).send();
    }
    catch (err){
        resp.status(400).send({
            erro: err.message
        })
    }
})


export default server;