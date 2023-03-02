const pool = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaJwt = require('../senhaJwt');


const usuariOcadastrar = async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        const senhAcrip = await bcrypt.hash(senha, 10)

        const usuariOnovo = await pool.query (
            ' insert into usuarios (nome, email, senha) values ($1, $2, $3)',
            [nome, email, senhAcrip]
            )    
            
        const { rows } = await pool.query(` select * from usuarios where email = $1`, [email])    
    
        return res.status(201).json({ id: rows[0].id, nome: nome, email: email })

    } catch (error) {
       
        return res.status(500).json({mensagem: 'O servidor apresentou um erro !'})
    }
}


const usuariOlogin = async (req, res) => {
    const { email, senha } = req.body

    try {
        const usuario = await pool.query(`select * from usuarios where email = $1`, [email])

        if(usuario.rowCount < 1){
            return res.status(400).json({mensagem: 'E-mail e/ou senha invalida !'})
        }

        const comparaRsenha = await bcrypt.compare(senha, usuario.rows[0].senha)

        if(!comparaRsenha){
            return res.status(400).json({mensagem: 'E-mail e/ou senha invalida !'})
        }
        
        const token = jwt.sign({id: usuario.rows[0].id, nome: usuario.rows[0].nome}, senhaJwt, {expiresIn: '8h'})

        const {senha: _, ...usuariOlogado } = usuario.rows[0] 

        return res.json({ usuario: usuariOlogado, token })

    } catch (error) {
       
        return res.status(500).json({mensagem: 'O servidor apresentou um erro !'})
    }
}


const usuariOdetalhar = async (req,res) => {
    
    try {
        return res.json({id: req.usuario.id, nome: req.usuario.nome, email: req.usuario.email })  

    } catch (error) {

        return res.status(404).json({ mensagem: 'Token inválido !'})
    }
}


const usuariOatualizar = async (req,res) => {
    
    const { nome, email, senha } = req.body
        
    try {

        const novAsenhAcrip = await bcrypt.hash(senha, 10)

        await pool.query(
            'update usuarios set nome = $2, email = $3, senha = $4 where id = $1',
            [req.usuario.id, nome, email, novAsenhAcrip]
        )

        return res.status(204).send()
        
    } catch (error) {

        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }
}

module.exports = {
    usuariOcadastrar,
    usuariOlogin,
    usuariOdetalhar,
    usuariOatualizar
}


