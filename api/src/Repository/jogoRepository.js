import { conx } from "./connecion.js";

///Parte do Produto
export async function inserirProduto (produto){
    const comando = `INSERT INTO tb_produto (id_categoria, nm_produto, vl_preco, vl_preco_promocional, bt_destaque, bt_promocao, bt_disponivel, qtd_estoque, ds_details)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`

    const [resposta] = await conx.query(comando, [produto.categoria, produto.nome, produto.preco, produto.precoPro, produto.destaque, produto.promocao, produto.disponivel, produto.qtd, produto.details]);
    produto.id = resposta.insertId;

    return produto;
}

export async function todosJogos(){
    const comando = `
    SELECT id_produto     id,
    nm_produto        nome,
    vl_preco          valor,
    vl_preco_promocional     promocao,
    qtd_estoque       estoque,
    ds_detalhes       descricao
    FROM tb_produto;`

    const [linhas] = await conx.query(comando);
    return linhas;
}

export async function alterarProduto(id, produto){
    const comando =`
    UPDATE tb_produto
    SET nm_produto =    ?,
        vl_preco =      ?,
        vl_preco_promocional =  ?,
        bt_destaque =   ?,
        bt_promocao =   ?,
        bt_disponivel = ?,
        qtd_estoque =   ?,
        ds_detalhes =   ?,
        id_categoria = ?,
        id_admin     =  ?
    WHERE    id_produto = ?;
    `
    const [resposta] = await conx.query(comando, [produto.nome, produto.preco, produto.precoPro, produto.destaque, produto.promocao, produto.disponivel, produto.qtd, produto.details, produto.categoria, produto.admin, id])
    return resposta.affectedRows;
}

export async function deletarProduto(id){
    const comando =`
    DELETE FROM tb_produto
        WHERE id_produto = ?`;
    const [resposta] = await conx.query(comando, [id]);
    return resposta.affectedRows;
};

////////////////////////////////////////////////////////////////////////////////

export async function AlterarImagem(imagem, id){
    const comando = `
    UPDATE tb_produto_imagem
    SET img_produto =  ?
    WHERE id_produto =  ?`;

    const [resposta] = await conx.query(comando, [imagem, id]);
    return resposta.affectedRows
}