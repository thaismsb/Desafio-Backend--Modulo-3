const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body

    if (!nome) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório" })
    }
    if (!email) {
        return res.status(404).json({ mensagem: "O campo email é obrigatório" })
    }
    if (!senha) {
        return res.status(404).json({ mensagem: "O campo senha é obrigatório" })
    }
    if (!nome_loja) {
        return res.status(404).json({ mensagem: "O campo nome_loja é obrigatório" })
    }

    try {

        //validação usuário com o mesmo email
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json({ mensagem: "O email informado já existe." })
        }


        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome,email,senha,nome_loja) values ($1, $2, $3, $4)';

        const usuarioCadastrado = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível cadastrar o usuário." })
        }

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" })

    } catch (error) {
        return res.status(404).json({ mensagem: error.message })
    }
}

const detalharUsuario = async (req, res) => {

    const { usuario } = req;

    try {
        const { rows } = await conexao.query('select * from usuarios where id = $1', [usuario.id]);

        const { senha: senhaUsuario, ...usuario_Detalhado } = rows[0];

        return res.status(200).json({ usuario_Detalhado });

    } catch (error) {
        return res.status({ mensagem: error.message });
    }
}

const atualizarUsuario = async (req, res) => {

    //validação de campos obrigatórios
    const { nome, email, senha, nome_loja } = req.body;
    const { usuario } = req;

    if (!nome) {
        return res.status(404).json({ mensagem: "O campo nome é obrigatório" })
    }
    if (!email) {
        return res.status(404).json({ mensagem: "O campo email é obrigatório" })
    }
    if (!senha) {
        return res.status(404).json({ mensagem: "O campo senha é obrigatório" })
    }
    if (!nome_loja) {
        return res.status(404).json({ mensagem: "O campo nome_loja é obrigatório" })
    }

    try {

        //validação usuário com o mesmo email
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." })
        }

        //criptografar a senha antes de salvar no banco de dados
        const senhaCriptografadaAtualizada = await bcrypt.hash(senha, 10);

        //Atualizar as informações do usuário no banco de dados
        const queryAtualizar = 'update usuarios set (nome,email,senha,nome_loja)=($1, $2, $3, $4) where id= $5';

        const usuarioAtualizado = await conexao.query(queryAtualizar, [nome, email, senhaCriptografadaAtualizada, nome_loja, usuario.id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json({ mensagem: "Não foi possível atualizar o usuário." })
        }

        return res.status(201).json({ mensagem: "Usuário atualizado com sucesso!" })
    }
    catch {
        if (error.message === "jwt malformed" || error.message === "invalid signature") {
            return res.status(400).json({ mensagem: "Token inválido." })
        }
        return res.status(400).json({ mensagem: error.message })
    }

}






module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
}