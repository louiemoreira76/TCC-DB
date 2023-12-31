import { inserirProduto, todosJogos, alterarProduto, deletarProduto, InserirImagem, TBcategoriaProduto, todosGames,BuscarJogoNM, BuscarJogoID,
InserirVideo, MudarImagem, MudarVideo, MudarCproduto, MudarCcategoriap,SelecioneComentario, InserirFavorito, TodosFavoritados, ExcluirFavorito, 
FiltroCategoria, AdicionarAvaliacao, BuscarGamesID, InserirNoticia,ImagemNoticia, NoticiaId} from "../Repository/jogoRepository.js"

import { Router } from 'express';
const server = Router();

import multer from 'multer'; //img DB
const upload = multer({dest: 'tools/image'});
const uploadN = multer({dest: 'tools/now'})

server.post('/produto', async (req, resp) => {
    try {
        const produtoParaInserir = req.body;

        // Valide se todos os campos obrigatórios estão presentes
        const camposObrigatorios = [
            'nome', 'preco', 'precoPro', 'qtd', 'descricao', 'categoria', 'classificacao',
            'lancamento', 'tamanho', 'empresa', 'desenvolvedor'
        ];

        for (const campo of camposObrigatorios) {
            if (!produtoParaInserir[campo]) {
                throw new Error(`O campo "${campo}" é obrigatório.`);
            }
        }

        if (!produtoParaInserir.admin) {
            throw new Error('Administrador não logado!');
        }

        // Defina o campo 'disponivel' como false se não estiver presente no corpo da solicitação
        if (produtoParaInserir.disponivel === undefined) {
            produtoParaInserir.disponivel = false;
        }

        // Defina os campos 'promocao' e 'destaque' como false se não estiverem definidos
        if (produtoParaInserir.promocao === undefined) {
            produtoParaInserir.promocao = false;
        }

        if (produtoParaInserir.destaque === undefined) {
            produtoParaInserir.destaque = false;
        }

        
        await inserirProduto(produtoParaInserir);

         resp.status(200).send(produtoParaInserir);

    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
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

server.get('/games', async (req, resp) => {
    try{
        const resposta = await todosGames();
        resp.send(resposta)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get(`/games/:id`, async(req, resp) => {
    try {
        const { id } = req.params; // parametro na url

        if (!id) {
            resp.status(400).send({ erro: 'O parâmetro "id" é obrigatório.' });
            return;
        }

        const resposta = await BuscarGamesID(id);

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

server.put('/produto/:id/imagens', upload.array('imagens', 5), async (req, resp) => {
    try{
        const {id} = req.params;
        const imagens = req.files.map(file => file.path); // Array de arquivos de imagem, por isso files

        if (!imagens || imagens.length === 0){
            throw new Error('Precisa escolher pelo menos uma imagem!')
        }

        console.log({imagem: imagens[0], id: id});

        // Lógica para salvar as imagens no banco de dados ou armazenamento
        const resposta = await InserirImagem(imagens[0], id);
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

server.post('/produto/video/url', async(req, resp) => {           //////////////////////////////
    try{
        const video = req.body

        if(!video.produto)
        throw new Error ('id do produto não vilculado ao video')

        if (!video.url)
        throw new Error ('url tem que ser inserida')

        const EnviarUrl = await InserirVideo(video)

        resp.send(EnviarUrl)

    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

///para adicionar na tabela intermediaria 
server.post('/produto/categoria', async(req, resp) => {
    try{
        const IDcategoriaPro = req.body

        if(!IDcategoriaPro.categoria)
        throw new Error ('ID da Categoria não pode ser inserida no sistema')

        if(!IDcategoriaPro.produto)
        throw new Error ('ID do produto não pode ser inserida no sistema')

        const InsertCategoriaProduto = await TBcategoriaProduto(IDcategoriaPro)

        resp.send(InsertCategoriaProduto)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })  
    }
})

server.get('/produto/buscar', async (req, resp) => {
    try {
        const { nome } = req.query; 
        if (!nome) {
            throw new Error('O parâmetro "nome" é obrigatório!');
        }

        const resposta = await BuscarJogoNM(nome);

        if (resposta.length === 0) {
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


server.get('/produto/:id', async (req, resp) => {
    try {
        const { id } = req.params; // parametro na url

        if (!id) {
            resp.status(400).send({ erro: 'O parâmetro "id" é obrigatório.' });
            return;
        }

        const resposta = await BuscarJogoID(id);

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

server.put('/produto/:id', async (req, resp) => {
    try {
        const { id } = req.params;
        const produto = req.body;

        // Verificar se o ID do produto é um número válido
        if (isNaN(id)) {
            throw new Error('ID do produto não é válido.');
        }

        // Verificar se pelo menos um dos campos a serem atualizados foi fornecido no corpo da solicitação
        if (!produto.nome && !produto.preco && !produto.precoPro && produto.destaque === undefined && produto.promocao === undefined && produto.disponivel === undefined && !produto.qtd && !produto.descricao && !produto.classificacao && !produto.lancamento && !produto.tamanho && !produto.empresa && !produto.desenvolvedor && !produto.categoria && !produto.admin) {
            throw new Error('Nenhum campo a ser atualizado foi fornecido.');
        }

        const resposta = await alterarProduto(id, produto);

        if (resposta !== 1) {
            throw new Error('Produto não pode ser alterado.');
        } else {
            resp.status(204).send();
        }
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});

server.put('/produto/:id/url', async (req, resp) => {
    try {
        const { id } = req.params;
        const { url } = req.body;

        if (!url) {
            throw new Error('A URL do vídeo é necessária para a alteração.');
        }

        const change = await MudarVideo(id, url);

        if (change === 1) {
            resp.status(204).send();
        } else {
            throw new Error('Produto não encontrado ou a URL não pode ser atualizada.')
        }
    } catch (err) {
        resp.status(400).send({ erro: err.message });
    }
});

server.put('/produto/:id/P', async (req, resp) => {
    try{
        const {id} = req.params;
        const {idcategoria} = req.body;

        if(!idcategoria){
            throw new Error('Inserir a categoria é necessario para a alteração!')
        }

        const change = await MudarCproduto(id, idcategoria)

        if (change === 1) {
            resp.status(204).send();
        } else {
            throw new Error('Produto não encontrado ou a categoria não pode ser atualizada')
        }
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.put('/produto/:id/CP', async (req, resp) => {
    try {
        const { id } = req.params;
        const { idcategoria } = req.body;

        if (!idcategoria) {
            throw new Error('Inserir a categoria é necessário para a alteração!');
        }

        const change = await MudarCcategoriap(idcategoria, id);  

        if (change === 1) {
            resp.status(204).send();
        } else {
            throw new Error('Produto não encontrado ou a categoria não pode ser atualizada');
        }
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});


server.put('/mudar/:id/imagens', upload.array('imagens', 5), async (req, resp) => {
    try{
        const {id} = req.params;
        const imagens = req.files.map(file => file.path); // Array de arquivos de imagem, por isso files

        if (!imagens || imagens.length === 0){
            throw new Error('Precisa escolher pelo menos uma imagem!')
        }

        console.log({imagem: imagens[0], id: id});

        // Lógica para salvar as imagens no banco de dados ou armazenamento
        const resposta = await MudarImagem(id, imagens[0]);
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

server.post('/favoritar', async(req, resp) => {
    try{
        const favoritar = req.body

        if (!favoritar.produto)
        throw new Error ('O id do produto é obrigatorio');

        if (!favoritar.cliente)
        throw new Error ('O id do cliente é obrigatorio');

        const Favoritacao = await InserirFavorito(favoritar)

        resp.status(200).send({ Favoritacao }); //status HTTP 200 junto com o corpo da resposta no formato JSON.
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/favoritos/:id', async(req, resp) => {
    try{
        const { id } = req.params;

        if (!id) {
            resp.status(400).send({ erro: 'O parâmetro "id" é obrigatório.' });
            return;
        }

        const BuscarFavoritos = await TodosFavoritados(id);

        if (!BuscarFavoritos) {
            resp.status(404).send([]);
        } else {
            resp.send(BuscarFavoritos);
        }
    }
    catch (err) {
        resp.status(500).send({
            erro: err.message
        });
    }
})

server.delete('/favorito/:id', async(req, resp) => {
    try{
        const { id } = req.params;

        const resposta = await ExcluirFavorito(id);

        if(resposta != 1)
        throw new Error('Produto favoritado não pode ser removido!');

        resp.status(204).send();
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/categorias/:id', async(req, resp) => {
    try{
        const { id } = req.params;

        if (!id) {
            resp.status(400).send({ erro: 'O parâmetro "id" é obrigatório.' });
            return;
        }

        const resposta = await FiltroCategoria(id);

        if (!resposta) {
            resp.status(404).send([]);
        } else {
            resp.send(resposta);
        }
    }
    catch(err){ 
    resp.status(400).send({
        erro: err.message
    })
    }
})

server.post('/avaliacao/:id', async(req, resp) => {
    try{
        const { id } = req.params
        const avaliacao = req.body;

        if (isNaN(id)) {
            throw new Error('ID do produto não é válido.');
        }

        if (!avaliacao.id_cliente){
            throw new Error('ID cliente está vazio');
        }

        if(!avaliacao.comentario){
            throw new Error('Comentario está vazio');
        }

        if(!avaliacao.avaliacao){
            throw new Error('Avaliação está vazio');
        }

        const resposta = await AdicionarAvaliacao(id, avaliacao);

        if (resposta !== 1) {
            throw new Error('Produto não pode ser alterado.');
        } else {
            resp.status(204).send();
        }
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get(`/comentario/:id`, async(req, resp) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            throw new Error('ID do produto não é válido.');
        }

        const resposta = await SelecioneComentario(id);
        console.log('Resposta da SelecioneComentario:', resposta); // Adicione este log

        resp.status(200).send(resposta);
    } catch (err) {
        console.error('Erro na rota /comentario/:id:', err.message);
        resp.status(400).send({
            erro: err.message
        });
    }
});

server.post(`/noticia/new`, async (req, resp) => {
    try {
        const noticia = req.body;

        if (!noticia.titulo)
            throw new Error('O título da notícia é obrigatório');

        if (!noticia.subtitulo)
            throw new Error('O subtitulo da notícia é obrigatório');

        if (!noticia.texto)
            throw new Error('O texto da notícia é obrigatório');

        const idNoticia = await InserirNoticia(noticia.titulo, noticia.subtitulo, noticia.texto);

        resp.status(200).send({ id: idNoticia });
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        });
    }
});

server.put(`/noticia/:id/imagens`, uploadN.array('imagens', 5), async (req, resp) => {
    try{
        const {id} = req.params;
        const imagens = req.files.map(file => file.path); 

        if (!imagens || imagens.length === 0){
            throw new Error('Precisa escolher pelo menos uma imagem!')
        }

        const resposta = await ImagemNoticia(imagens[0], id);

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

server.get(`/noticia`, async (req, resp) => {
    try{
        const resposta = await todasNoticias();
        resp.send(resposta)
    }
    catch(err){
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get(`/noticia/:id`, async (req, resp) => {
    try{
        const { id } = req.params;

        if (isNaN(id)) {
            throw new Error('ID do noticia não é válido.');
        }

        const resposta = await NoticiaId(id);

        resp.status(200).send(resposta);
    }
    catch(err){

    }
})

export default server; 