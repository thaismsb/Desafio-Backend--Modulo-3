const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const produtos = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express();

//Cadastrar Usuário
rotas.post('/usuario', usuarios.cadastrarUsuario);

//Login
rotas.post('/login', login.login);

//filtro
rotas.use(verificaLogin);

//Detalhar Usuário
rotas.get('/usuario', usuarios.detalharUsuario);

//Atualizar Usuário
rotas.put('/usuario', usuarios.atualizarUsuario);

//Listar produtos do usuário logado
rotas.get('/produtos', produtos.listarProdutosDeUsuario);

//Detalhar um produto do usuário logado
rotas.get('/produtos/:id', produtos.detalharProdutosDeUsuario);

//Cadastrar produto para o usuário logado
rotas.post('/produtos', produtos.cadastrarProduto);

//Atualizar produto do usuário logado
rotas.put('/produtos/:id', produtos.atualizarProduto);

//Excluir produto do usuário logado
rotas.delete('/produtos/:id', produtos.deletarProduto);


module.exports = rotas;