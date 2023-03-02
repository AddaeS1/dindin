const express = require('express')
const listarCategorias = require("./controladores/categorias");
const { transacaOcadastrar, transacaOdetalhar, transacaOatualizar, transacaOlistar, transacaOexcluir, transacaOextrato } = require('./controladores/transacoes');
const { usuariOcadastrar, usuariOdetalhar, usuariOlogin, usuariOatualizar } = require("./controladores/usuarios");
const usuariOautenticar = require('./intermediarios/autenticacao');
const verificaBodyTransacao = require('./intermediarios/IntermediariosTransacao');
const { verificarBodyUser, verificaEmailExistente } = require('./intermediarios/IntermediariosUser');


const rotas = express();

rotas.post('/login', usuariOlogin )
rotas.post('/usuario', verificarBodyUser , verificaEmailExistente, usuariOcadastrar)

rotas.use(usuariOautenticar)

rotas.get('/categoria', listarCategorias)

rotas.put('/transacao/:id',verificaBodyTransacao, transacaOatualizar)
rotas.post('/transacao' , verificaBodyTransacao, transacaOcadastrar)
rotas.get('/transacao/extrato', transacaOextrato)
rotas.get('/transacao/:id', transacaOdetalhar)
rotas.get('/transacao',  transacaOlistar)


rotas.delete('/transacao/:id', transacaOexcluir)

rotas.get('/usuario', usuariOdetalhar)
rotas.put('/usuario', verificarBodyUser , verificaEmailExistente ,usuariOatualizar)



module.exports = rotas ;