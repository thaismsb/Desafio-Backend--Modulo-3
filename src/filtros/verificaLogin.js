const jwt = require('jsonwebtoken');
const segredo = require('../segredo');
const conexao = require('../conexao');

const verificaLogin = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {

        return res.status(404).json({ mensagem: "Token não informado." })
    };

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, segredo);

        const query = 'select * from usuarios where id = $1';

        const { rows, rowCount } = await conexao.query(query, [id]);
        //verifica se encontra usuario
        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "usuário não encontrado." })
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        if (error.message === "jwt malformed" || error.message === "invalid signature" || error.message === "invalid token") {
            return res.status(400).json({ mensagem: "Token inválido." })
        }
        if (error.message === "jwt must be provided") {
            return res.status(400).json({ mensagem: "Um token precisa ser informado." })
        }
        return res.status(400).json({ mensagem: error.message })
    }

}

module.exports = verificaLogin;