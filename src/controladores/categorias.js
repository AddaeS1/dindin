const pool = require('../conexao');


const listarCategorias = async (req, res) => {
   try {
    const categoriaListar = await pool.query(
    'select * from categorias'
    )
    return res.json(categoriaListar.rows)    
   } catch (error) {
    return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
   } 
}

module.exports = listarCategorias;