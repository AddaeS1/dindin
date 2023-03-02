const jwt = require('jsonwebtoken')
const senhaJwt = require("../senhaJwt");
const pool = require('../conexao');

const usuariOautenticar = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(404).json({mensagem: 'Não autorizado !'})
    }
    
    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, senhaJwt)
        
        const { rows, rowCount } = await pool.query('select * from usuarios where id = $1', [id])

        if(!rowCount){
            return res.status(401).json({mensagem: 'Não autorizado !'})
        }

        req.usuario = ({id: rows[0].id, nome: rows[0].nome, email: rows[0].email})

        next()
        
    } catch (error) {
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }
}

module.exports = usuariOautenticar
