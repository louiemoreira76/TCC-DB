USE GameSync;

-- carga inicial usuario adim
INSERT INTO tb_admin (ds_email, ds_senha, vl_codigo)
VALUES ('admin@admin.com.br', '1234', NULL);

-- Inserir um novo cliente
INSERT INTO tb_cliente (nm_cliente, ds_telefone, ds_cpf, ds_email, ds_senha)
VALUES ('João da Silva', '(11) 9876-5432', '123.456.789-01', 'joao@email.com', 'senha123');

SELECT * FROM tb_admin;

-- Efetuar login
SELECT id_admin AS id,
       ds_email AS email
FROM tb_admin
WHERE ds_email = 'admin@admin.com.br'
AND ds_senha = '1234';

SELECT * FROM tb_cliente;

SELECT id_cliente AS id,
       ds_email AS email
FROM tb_cliente
WHERE ds_email = 'admin@admin.com.br' ////////////errrado
AND ds_senha = '1234';

--Cadastrar novo jogo
INSERT INTO tb_jogo (nm_titulo, ds_genero, qtd_conquistas, ds_classificacao, dt_lancamento, nr_tamanho, ds_empresa_publi, ds_desenvolvedor)
VALUES ('Brunex O Ninja', 'Ação', 10, 'Livre', '2023-08-18', 4.5, 'Empresa XYZ', 'Desenvolvedor ABC');

SELECT * FROM tb_jogo;

-- Alterar imagem do jogo
UPDATE tb_produto_imagem
SET img_jogo = '/storage/jogo/adshsf.jpg'
WHERE id_jogos = 1;

-- Alterar jogo
UPDATE tb_jogo
SET nm_titulo = 'O Kara',
    ds_genero = 'Aventura',
    qtd_conquistas = 5,
    ds_classificacao = 'Maiores de 18',
    dt_lancamento = '2010-08-17',
    nr_tamanho = 6.2,
    ds_empresa_publi = 'Nova Empresa',
    ds_desenvolvedor = 'Novo Desenvolvedor'
WHERE id_jogos = 1;

-- Remover jogo
DELETE FROM tb_jogo
WHERE id_jogos = 1;

-- Consultar todos jogos
SELECT id_jogos AS id,
       nm_titulo AS nome,
       nr_tamanho AS tamanho,
       dt_lancamento AS lancamento,
       bt_disponivel AS disponivel
FROM tb_jogo;

-- Consultar todos jogos por nome
SELECT id_jogos AS id,
       nm_titulo AS nome,
       nr_tamanho AS tamanho,
       dt_lancamento AS lancamento,
       bt_disponivel AS disponivel
FROM tb_jogo
WHERE nm_titulo LIKE '%a%';

-- Consultar jogo por ID
SELECT id_jogos AS id,
       nm_titulo AS nome,
       nr_tamanho AS tamanho,
       dt_lancamento AS lancamento,
       bt_disponivel AS disponivel
FROM tb_jogo
WHERE id_jogos = 1;

INSERT INTO tb_produto (nm_produto, vl_preco, vl_preco_promocional, bt_destaque, bt_promocao, bt_disponivel, qtd_estoque, ds_detalhes)
VALUES ('Ninja Coder', 249.99, 139.99, 1, 1, 1, 100, 'Em "Code Ninja", você é um habilidoso ninja da programação em uma jornada para se tornar o mestre do código. Enfrente desafios digitais, resolva quebra-cabeças, e proteja o código-fonte enquanto descobre uma conspiração que ameaça o mundo virtual e real. Torne-se um lendário "Code Ninja" dominando linguagens de programação e estratégias únicas.');
