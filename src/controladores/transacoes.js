const pool = require('../conexao');


const transacaOcadastrar = async (req, res) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body

    try {
        const { rows } = await pool.query( ` 
        insert into transacoes ( tipo, descricao, valor, data, usuario_id, categoria_id )
        values ($1, $2, $3, $4, $5, $6) returning * `, [tipo, descricao, valor, data, req.usuario.id, categoria_id ]
        )

        const categoria = await pool.query('select descricao from categorias where id = $1 ', [categoria_id])
        
        return res.json({
            id: rows[0].id,tipo: tipo,descricao: descricao,valor: valor,data: data,
            usuario_id: req.usuario.id ,categoria_id: categoria_id,categoria_nome: categoria.rows[0].descricao
         })

    } catch (error) {
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
   } 
}


const transacaOlistar = async (req,res) => {

    try {
        
        const { rows: editrows }  = await pool.query(` select transacoes.id, transacoes.tipo,
         transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, transacoes.categoria_id,
           categorias.descricao as categoria_nome from transacoes JOIN categorias
            on transacoes.categoria_id = categorias.id where transacoes.usuario_id = $1 `,[req.usuario.id])
       
       return res.json(editrows)
                         
        
    } catch (error) {
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }
}


const transacaOdetalhar = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query(
        'select * from transacoes where id = $1 and usuario_id = $2 ',
        [id, req.usuario.id]
        )
        
        if(rowCount < 1){
        return res.status(404).json({mensagem: 'Transação não encontrada'})
        }

        const {rows: editrow} = await pool.query(`select transacoes.id, transacoes.tipo,
        transacoes.descricao, transacoes.valor, transacoes.data, transacoes.usuario_id, transacoes.categoria_id,
          categorias.descricao as categoria_nome from transacoes JOIN categorias
           on transacoes.categoria_id = categorias.id where transacoes.usuario_id = $1 and transacoes.id = $2 `,[req.usuario.id, id])

           return res.status(201).json(editrow)
        
    } catch (error) {
       
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }
}


const transacaOatualizar = async (req,res) => {
    const { id } = req.params;
    const {descricao, valor, data, categoria_id, tipo} = req.body;

    try {
        const { rowCount } = await pool.query(
        'select * from transacoes where id = $1 and usuario_id = $2 ',
        [id, req.usuario.id]
        )
        
        if(rowCount < 1){
            return res.status(404).json({mensagem: 'Transação não encontrada'})
            }

        await pool.query(
            'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id =$6',
            [descricao, valor, data, categoria_id, tipo, id]
        )

        return res.status(204).send()


    } catch (error){
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }
}


const transacaOexcluir = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query(
            'select * from transacoes where id = $1 and usuario_id = $2 ',
            [id, req.usuario.id]
        )

        if(rowCount < 1) {
            return res.status(400).json({mensagem: 'Transação não encontrada !'})
        }
        
        await pool.query('delete from transacoes where id = $1 and usuario_id = $2 ',
        [id, req.usuario.id])

        return res.status(204).send()
    } catch (error) {
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
        
    }
}


const transacaOextrato = async (req, res) => {

    try {

        const entradas = await pool.query(`
        select sum(valor) as entrada from transacoes where tipo = 'entrada' and usuario_id = $1`, [req.usuario.id]
        )
        
        const saidas = await pool.query(`
        select sum(valor) as saida from transacoes where tipo = 'saida' and usuario_id = $1`, [req.usuario.id]
        ) 
               
        return res.status(201).json({ entrada: entradas.rows[0].entrada , saida: saidas.rows[0].saida })

    } catch (error) {
        
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !'})
    }

    
}



module.exports = {
   transacaOcadastrar,
   transacaOlistar,
   transacaOdetalhar,
   transacaOatualizar,
   transacaOexcluir,
   transacaOextrato

}