import { conx } from "./connecion.js";

export async function inserirProduto (produto){
    const comando = `INSERT INTO tb_produto (id_categoria, nm_produto, vl_preco, vl_preco_promocional, bt_destaque, bt_promocao, bt_disponivel, qtd_estoque, ds_detalhes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`

    const [resposta] = await conx.query(comando, [produto.categoria, produto.nome, produto.preco, produto.precoPro, produto.destaque, produto.promocao, produto.disponivel, produto.qtd, produto.details]);
    produto.id = resposta.insertId;

    return produto;
}

