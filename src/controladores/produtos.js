const conexao = require('../conexao');

const listarProdutosDeUsuario = async (req, res) => {

    const { usuario } = req;

    try {
        const produtosDoUsuario = await conexao.query('select * from produtos where usuario_id = $1', [usuario.id]);

        return res.status(200).json(produtosDoUsuario.rows);

    } catch (error) {
        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(401).json({ mensagem: "Token inválido." })
        }
        return res.status(401).json({ mensagem: error.message })
    }
}

const detalharProdutosDeUsuario = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id= $2';
        const produtoExistente = await conexao.query(queryProdutoExistente, [id, usuario.id]);

        if (produtoExistente.rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com id = ${id} e usuário = ${usuario.id} .` })
        }

        return res.status(200).json(produtoExistente.rows);

    } catch (error) {
        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(400).json({ mensagem: "Token inválido." })
        }
        return res.status(400).json({ mensagem: error.message })
    }

}

const cadastrarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;

    if (!nome) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório." })
    }
    if (!quantidade) {
        return res.status(404).json({ mensagem: "O campo quantidade é obrigatório." })
    }
    if (quantidade < 0) {
        return res.status(404).json({ mensagem: "A quantidade precisa ser maior que zero." })
    }
    if (!preco) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório." })
    }
    if (!descricao) {
        return res.status(404).json({ mensagem: "O campo descricao é obrigatório." })
    }

    try {

        const queryCadastrarProduto = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem ) values ($1 , $2, $3, $4, $5, $6, $7)';
        const produtoCadastrado = await conexao.query(queryCadastrarProduto, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

        if (produtoCadastrado.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o produto" })
        }

        return res.status(201).json({ mensagem: "Produto cadastrado com sucesso." })

    } catch (error) {

        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(401).json({ mensagem: "Token inválido." });
        }
        return res.status(401).json({ mensagem: error.message });
    }
}

const atualizarProduto = async (req, res) => {

    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const { usuario } = req;
    const { id } = req.params;

    if (!nome) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório." })
    }
    if (!quantidade) {
        return res.status(404).json({ mensagem: "O campo quantidade é obrigatório." })
    }
    if (!preco) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório." })
    }
    if (!descricao) {
        return res.status(404).json({ mensagem: "O campo descricao é obrigatório." })
    }

    try {
        const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id= $2';
        const produtoExistente = await conexao.query(queryProdutoExistente, [id, usuario.id]);

        if (produtoExistente.rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com id = ${id} e usuário = ${usuario.id} .` })
        }

        const queryAtualizarProduto = `update produtos set (nome, quantidade, categoria, preco, descricao, imagem)= ($1,$2,$3,$4,$5,$6) 
        where id =$7 and usuario_id = $8.`;
        const produtoAtualizado = await conexao.query(queryAtualizarProduto, [nome, quantidade, categoria, preco, descricao, imagem, id, usuario.id]);

        if (produtoAtualizado.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar as informações do produto." })
        }

        return res.status(201).json({ mensagem: " Informações do produto atualizadas com sucesso!" })


    } catch (error) {
        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(401).json({ mensagem: "Token inválido." });
        }
        return res.status(401).json({ mensagem: error.message });
    }
}

const deletarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const queryProdutoExistente = 'select * from produtos where id = $1 and usuario_id= $2';
        const produtoExistente = await conexao.query(queryProdutoExistente, [id, usuario.id]);


        if (produtoExistente.rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com id = ${id} e usuário = ${usuario.id}.` });
        }

        const { rowCount } = await conexao.query('delete from produtos where id = $1', [id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível excluir o produto." });
        }

        return res.status(400).json({ mensagem: "Produto excluído com sucesso." });

    } catch (error) {
        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(400).json({ mensagem: "Token inválido." })
        }
        return res.status(400).json({ mensagem: error.message })
    }
}

module.exports = {
    listarProdutosDeUsuario,
    detalharProdutosDeUsuario,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
}