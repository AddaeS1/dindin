
const pool = require('../conexao');

const verificarBodyUser = async (req, res, next) => {
    const { nome, email, senha } = req.body

    try {

        if(!nome){
            return res.status(404).json({mensagem: 'É obrigatório a informação do nome !'})
        }

        if(!email){
            return res.status(404).json({mensagem: 'É obrigatório a informação do email !'})
        }

        if(!senha){
            return res.status(404).json({mensagem: 'É obrigatório a informação da senha !'})
        }
        
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'O servidor apresentou um erro !'})
    }

    
}


const verificaEmailExistente = async (req, res, next) => {
    const { email } = req.body

    try {
        const { rowCount} = await pool.query(
            `select * from usuarios where email = $1`, [email]
        )
    
        if(rowCount != 0){
            return res.status(409).json({mensagem: 'E-mail já cadastrado, favor informar e-mail válido !'})
        }

        next()
    } catch (error) {
        
        return res.status(500).json({mensagem: 'O servidor apresentou um erro !'})
    }
    
} 

module.exports = { verificarBodyUser, verificaEmailExistente}