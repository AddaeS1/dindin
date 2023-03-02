const verificaBodyTransacao = async (req, res, next) => {
    const { tipo, descricao, valor, data, categoria_id } = req.body

    try {
        if(!tipo){
            return res.status(404).json({mensagem: 'É obrigatório a informação do tipo da transação !'})
        }

        if(!descricao){
            return res.status(404).json({mensagem: 'É obrigatório a informação da descrição da transação !'})
        }
    
        if(!valor){
            return res.status(404).json({mensagem: 'É obrigatório informar o valor da transação !'})
        }
    
        if(!data){
            return res.status(404).json({mensagem: 'É obrigatório informar a data da transação!'})
        }
    
        if(!categoria_id){
            return res.status(404).json({mensagem: 'É obrigatório a informação da categoria_id da transação !'})
        }
    
        if(!tipo){
            return res.status(404).json({mensagem: 'É obrigatório a informação do tipo(entrada/saída) de transação !'})
        }

        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'O servidor apresentou um erro !'})
        
    }
    

}

module.exports = verificaBodyTransacao;