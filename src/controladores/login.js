const conexao = require('../conexao')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const login = async (req, res) => {

    const { email, senha } = req.body;

    if (!email) {
        return res.status(404).json({ mensagem: "O campo email é obrigatório" })
    }
    if (!senha) {
        return res.status(404).json({ mensagem: "O campo senha é obrigatório" })
    }

    try {
        //verificar se existe email
        const queryverificaEmail = 'select * from usuarios where email = $1';
        const { rows, rowCount } = await conexao.query(queryverificaEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "usuário não encontrado" })
        }

        const usuario = rows[0];

        const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!senhaVerificada) {
            return res.status(400).json({ mensagem: "Email e senha não confere." });
        }

        const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '1d' });

        return res.status(200).json({ token });

    } catch (error) {
        return res.status(404).json({ mensagem: "Erro" })
    }
}


module.exports = {
    login
}